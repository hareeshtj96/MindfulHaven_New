import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import {
  fetchAvailableSlots,
  saveAppointment,
  fetchBookedSlots,
  checkSlotBeforePayment
} from "../../Redux/Store/Slices/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CheckSlotResponse {
  available: boolean;
  status: boolean;
  message: string;
}

const SlotManagement = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  console.log("therapist id slot:", therapistId);
  
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

  const therapiststaet = useSelector((state:RootState) => state.user);
  console.log("therapist state slot:", therapiststaet);
  

  const therapist = useSelector((state: RootState) => {
    const therapistList = [
      ...(state.user.therapists?.therapists || []),
      ...(state.user.familyTherapists?.therapists || []),
      ...(state.user.coupleTherapists?.therapists || []),
      ...(state.user.individualTherapists?.therapists || [])
  ]; 

    return therapistList.find((t) => t._id === therapistId);
});



  const user = useSelector((state: RootState) => state.user.user);
  const userIdentity = user?.userId;

  const availableSlots = useSelector(
    (state: RootState) => state.user.availableSlots || []
  );
  const bookedSlots = useSelector(
    (state: RootState) => state.user.bookedSlots || []
  );
  const timings = useSelector((state: RootState) => state.user.timings || []);
  const booked = useSelector((state: RootState) => state.user.booked);
  console.log("booked;", booked);
  
  
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  useEffect(() => {
    if (therapistId) {
      dispatch(fetchAvailableSlots(therapistId));
    }
  }, [therapistId, dispatch]);

  useEffect(() => {
    if (therapistId) {
      dispatch(fetchBookedSlots(therapistId));
    }
  }, [therapistId, dispatch]);

  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleSubmit = async () => {
    if (selectedDate && selectedTime && therapistId) {
      const userId = userIdentity || "undefined";

      const slot = new Date(`${selectedDate}T${selectedTime}:00Z`);
      const convenienceFees = 80;
      const totalAmount = (therapist?.fees ?? 0) + convenienceFees;

      const appointmentData = {
        userId,
        therapistId,
        slot,
        totalAmount,
      };
      const slotDate = slot.toISOString().split("T")[0];
      const slotTime = slot.toISOString().split("T")[1].substring(0,5);

      try {
        const response : CheckSlotResponse =  await dispatch(checkSlotBeforePayment({therapistId, slotDate, slotTime})).unwrap();
       
        if (response.status) {
          navigate(`/payment`, { state: appointmentData });
        } else {
          toast.error(response.message);
        }
        
      } catch (error) {
        console.error("Appointment booking failed:", error);
      }
    } else {
      toast.error("Please select a slot and add any necessary notes.");
    }
  };

  

  const filterBookedSlotsByDate = (
    date: string,
    availableTimes: string[],
    bookedSlots: string[]
  ): string[] => {
    const bookedSet = new Set(
      bookedSlots
        .filter((slot) => new Date(slot).toISOString().split("T")[0] === date)
        .map((slot) => new Date(slot).toISOString().substring(11, 16))
    );
    return availableTimes.filter((time) => !bookedSet.has(time));
  };

  const getFilteredSlots = (slots: string[], booked: string[]): string[] => {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);

    const slotsWithinRange = slots.filter((slot) => {
      const slotDate = new Date(slot);
      return slotDate >= now && slotDate <= threeMonthsLater;
    });

    // Filter out booked slots for selected date
    return filterBookedSlotsByDate(
      selectedDate ?? "",
      slotsWithinRange,
      booked
    );
  };

  const filteredSlots = getFilteredSlots(availableSlots, bookedSlots);

  

  const getBookedTimesForDate = (date: string): string[] => {

    if (!date || !Array.isArray(booked)) return [];
  
    // Filter the bookings for the selected date and map the booked times
    return booked
        .filter((slot) => {
            const bookingDate = new Date(slot.date).toISOString().split("T")[0];
            return bookingDate === date && slot.status === true
        }).map((slot) => slot.time)
  };

  // Generate time blocks dynamically between start and end time for the selected date
  const generateHourBlocks = (
    startTime: string,
    endTime: string,
    bookedTimes: string[]
  ): string[] => {
    const blocks: string[] = [];
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${endTime}:00Z`);
    let current = new Date(start);

    while (current < end) {
        const timeString = current.toISOString().substring(11, 16)

      if (!bookedTimes.includes(timeString)) {
        blocks.push(timeString);
      }
      current.setHours(current.getHours() + 1);
    }

    return blocks;
  };
  
  
  
  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!therapist) {
    return <div className="text-center mt-8">No therapist data available</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {therapist.name}
          </h2>
          <p className="text-gray-600 text-sm mb-4">{therapist.email}</p>
          <p className="text-gray-600 text-sm mb-4">
            {therapist.professionalExperience} years of experience
          </p>
        </div>

        {/* Available Dates */}
        <div className="mb-6 w-full">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Available Dates
          </h3>

          {Array.isArray(filteredSlots) && filteredSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {filteredSlots.map((slot: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleDateSelection(slot.split("T")[0])}
                  className={`${
                    selectedDate === slot.split("T")[0]
                      ? "bg-green-500"
                      : "bg-green-200"
                  } text-white font-semibold py-2 px-4 rounded-lg`}
                >
                  {new Date(slot).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </button>
              ))}
            </div>
          ) : (
            <div>No available dates</div>
          )}
        </div>

        {/* Time Blocks for Selected Date */}
        {selectedDate && (
          <div className="mb-6 w-full">
            <h3 className="text-xl font-semibold text-green-900 mb-4">
              Available Time Slots on {selectedDate}
            </h3>

            {timings.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {timings.map((timing, index) => {
                  // Get booked times for the selected date
                  const bookedTimes = getBookedTimesForDate(selectedDate ?? "");

                  return (
                    <div key={index} className="mb-4 p-4 border rounded-lg">
                      <p>
                        <strong>Day(s):</strong> {timing.dayOfWeek.join(", ")}
                      </p>
                      {generateHourBlocks(
                        timing.startTime,
                        timing.endTime,
                        bookedTimes
                      ).map((block, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTimeSelection(block)}
                          className={`${
                            selectedTime === block
                              ? "bg-blue-500 text-white"
                              : "bg-blue-200"
                          } text-gray-800 font-semibold py-1 px-4 rounded-lg m-1`}
                        >
                          {block}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>No time slots available for this day</div>
            )}
          </div>
        )}

        {/* Notes Section */}
        <div className="mb-6 w-full">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={handleNotesChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
            rows={4}
            placeholder="Add any notes for the appointment"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotManagement;
