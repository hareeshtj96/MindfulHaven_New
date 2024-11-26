import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import {
    fetchAvailableSlots,
    fetchBookedSlots,
    checkSlotBeforePayment
} from "../../Redux/Store/Slices/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactStars from "react-rating-stars-component";

interface CheckSlotResponse {
    available: boolean;
    status: boolean;
    message: string;
}

const SlotManagement = () => {
    const { therapistId } = useParams<{ therapistId: string }>();
    
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [notes, setNotes] = useState<string>("");
    const [showModal, setShowModal] = useState(false);

    // Toggle Modal Visibility
    const handleModalToggle = () => setShowModal(!showModal);




    const therapist = useSelector((state: RootState) => {
        const therapistList = [
            ...(state.user.therapists || []),
            ...(state.user.familyTherapists || []),
            ...(state.user.coupleTherapists || []),
            ...(state.user.individualTherapists || [])
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

    const issues = useSelector((state: RootState) => state.user.issues || [])
    const updatedTimings = useSelector((state: RootState) => state.user.updatedTimings || []);

    // Determine remaining reviews count
    const remainingReviews = issues.length > 2 ? issues.length - 2 : 0;

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
            const slotTime = slot.toISOString().split("T")[1].substring(0, 5);

            try {
                const response: CheckSlotResponse = await dispatch(checkSlotBeforePayment({ therapistId, slotDate, slotTime })).unwrap();

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

    const getFilteredSlots = (slots: { date: string; time: string }[], booked: string[]): { date: string; time: string }[] => {
        const now = new Date();
        const tenDaysLater = new Date();
        tenDaysLater.setDate(now.getDate() + 10);

        return slots.filter((slot) => {
            const slotDate = new Date(slot.date);
            const slotTime = new Date(`${slot.date}T${slot.time}`)

            const isInRange = slotDate.toDateString() === now.toDateString() ? slotTime > now : slotDate >= now && slotDate <= tenDaysLater;
            const isBooked = booked.some(
                (b) => b.startsWith(`${slot.date}T${slot.time}`)
            );
            return isInRange && !isBooked;
        })

    };


    // Function to generate date and time slots from updated timings
    const generateUpdatedSlots = (updatedTimings: any[]): { date: string; time: string }[] => {
        const slots: { date: string; time: string }[] = [];

        updatedTimings.forEach((timing) => {
            const date = timing.date.split("T")[0];
            timing.slots.forEach((slot: any) => {
                const start = new Date(`1970-01-01T${slot.startTime}:00Z`);
                const end = new Date(`1970-01-01T${slot.endTime}:00Z`);
                let current = new Date(start);

                while (current < end) {
                    slots.push({
                        date,
                        time: current.toISOString().substring(11, 16),
                    });
                    current.setHours(current.getHours() + 1);
                }
            })

        });

        return slots;
    };

    // Merged available slots with updated timings
    const mergedSlots = [
        ...availableSlots.map((slot) => ({ date: slot.split("T")[0], time: slot.split("T")[1]?.substring(0, 5) || "" })),
        ...generateUpdatedSlots(updatedTimings),
    ]
    

    // Get filtered slots using combinedTimings
    const filteredSlots = getFilteredSlots(mergedSlots, bookedSlots);


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
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-5xl">
                {/* Therapist Details */}
                <div className="flex flex-col items-center bg-gray-100 shadow-md rounded-lg p-6 w-full lg:w-1/2 mx-auto mb-8">
                    {/* Profile Picture */}
                    <div className="mb-6">
                        <img
                            src={therapist?.photo || "https://via.placeholder.com/150"}
                            alt="Therapist photo"
                            className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 shadow-lg"
                        />
                    </div>

                    {/* Therapist Information */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{therapist?.name || "Therapist Name"}</h2>
                    <p className="text-gray-600 text-base mb-1">{therapist?.email || "Therapist Email"}</p>
                    <p className="text-gray-600 text-base mb-1">{therapist?.phone || "Therapist Mobile"}</p>

                    <div className="text-center text-gray-700 mb-4">
                        <p className="font-medium text-lg">
                            {therapist?.professionalExperience || "0"} years of experience
                        </p>
                        <p className="italic">{therapist?.specialization || "Specialization not available"}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 w-full shadow-inner mb-4">
                        <p className="text-gray-600">
                            <strong>Education:</strong> {therapist?.educationalQualifications || "Not specified"}
                        </p>
                        <p className="text-gray-600">
                            <strong>Location:</strong> {therapist?.location || "Not specified"}
                        </p>
                        <p className="text-gray-600">
                            <strong>Establishment:</strong> {therapist?.establishment || "Not specified"}
                        </p>
                    </div>
                </div>



                {/* Available Dates */}
                <div className="mb-6 w-full">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Available Dates
                    </h3>
                    {filteredSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Array.from(new Set(filteredSlots.map((slot) => slot.date)))
                                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                                .map(
                                    (uniqueDate, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleDateSelection(uniqueDate)}
                                            className={`${selectedDate === uniqueDate ? "bg-green-500" : "bg-green-200"
                                                } text-white font-semibold py-2 px-4 rounded-lg`}
                                        >
                                            {new Date(uniqueDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </button>
                                    )
                                )}
                        </div>
                    ) : (
                        <div className="text-gray-600">No available dates</div>
                    )}
                </div>

                {/* Time Blocks for Selected Date */}
                {selectedDate && (
                    <div className="mb-6 w-full">
                        <h3 className="text-xl font-semibold text-green-900 mb-4">
                            Available Time Slots on {selectedDate}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {filteredSlots
                                .filter((slot) => slot.date === selectedDate)
                                .sort((a, b) => {
                                    const timeA = new Date(`1970-01-01T${a.time}`).getTime();
                                    const timeB = new Date(`1970-01-01T${b.time}`).getTime();
                                    return timeA - timeB;
                                })
                                .map((slot, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleTimeSelection(slot.time)}
                                        className={`${selectedTime === slot.time
                                            ? "bg-blue-500 text-white"
                                            : "bg-blue-200"
                                            } text-gray-800 font-semibold py-1 px-4 rounded-lg m-1`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

                {/* Notes Section */}
                <div className="mb-6 w-full">
                    <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Notes (optional)
                    </label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={handleNotesChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                        rows={4}
                        placeholder="Add any notes for the appointment"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-all"
                    >
                        Proceed to Payment
                    </button>
                </div>

                {/* Display User Details */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Ratings & Reviews</h3>

                    {/* Show only the first two reviews */}
                    {issues.slice(0, 2).map((issue) => (
                        <div key={issue._id} className="mb-6 p-4 bg-gray-50 shadow-md rounded-lg">
                            <div className="mb-2 flex items-center justify-between">
                                <ReactStars count={5} value={issue.rating} size={24} activeColor="#ffd700" edit={false} />
                                <p className="text-gray-600 text-sm ml-4">{issue.userEmail}</p>
                            </div>
                            <p className="text-gray-700">{issue.description}</p>
                        </div>
                    ))}

                    {/* See Other Reviews Link */}
                    {remainingReviews > 0 && (
                        <button
                            onClick={handleModalToggle}
                            className="text-blue-500 hover:underline"
                        >
                            See Other {remainingReviews} Reviews
                        </button>
                    )}

                    {/* Modal */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl">
                                <h3 className="text-xl font-bold mb-4">All Reviews</h3>

                                <div className="space-y-4">
                                    {issues.map((issue) => (
                                        <div key={issue._id}>
                                            <div className="flex items-center justify-between">
                                                <ReactStars
                                                    count={5}
                                                    value={issue.rating}
                                                    size={24}
                                                    activeColor="#ffd700"
                                                    edit={false}
                                                />
                                                <p className="text-gray-600 text-sm ml-4">
                                                    {issue.userEmail}
                                                </p>
                                            </div>
                                            <p className="mt-2">{issue.description}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={handleModalToggle}
                                    className="mt-4 text-white bg-red-400 px-4 py-2 rounded hover:bg-red-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>


            </div>
        </div>

    );
};

export default SlotManagement;
