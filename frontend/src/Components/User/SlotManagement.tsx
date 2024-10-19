import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { fetchAvailableSlots, saveAppointment, fetchBookedSlots,clearAppointmentStatus } from "../../Redux/Store/Slices/userSlice";
import { toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const SlotManagement = () => {
    const { therapistId } = useParams<{ therapistId: string }>(); 
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<String | null>(null);
    const [notes, setNotes] = useState<string>("");

    const therapist = useSelector((state: RootState) =>
        state.user.therapists.therapists.find(t => t._id === therapistId)
    );

    
    const user = useSelector((state: RootState) => state.user.user)
    const userIdentity = user?.userId
    console.log("user:", userIdentity);
    
    
    const availableSlots = useSelector((state: RootState) => state.user.availableSlots || []);
    const bookedSlots = useSelector((state: RootState) => state.user.bookedSlots || []);
    const timings = useSelector((state: RootState) => state.user.timings || []);
    const loading = useSelector((state: RootState) => state.user.loading);
    const error = useSelector((state: RootState) => state.user.error);
 
    console.log("avaialble slots from slot management:", availableSlots);
    console.log("booked slots from slot management:", bookedSlots);

    useEffect(() => {
        if (therapistId) {
            dispatch(fetchAvailableSlots(therapistId)); 
        }
    }, [therapistId, dispatch]);

    useEffect(() => {
        if(therapistId) {
            dispatch(fetchBookedSlots(therapistId));
        }
    },[therapistId, dispatch]);

    // useEffect(() => {
    //     if(appointmentStatus === "success") {
    //         toast.success("Appointment booked successfully")
    //         setSelectedDate(null);
    //         setSelectedTime(null);
    //         setNotes("");

           
            
    //     } else if ( appointmentStatus === "failed") {
    //         toast.error(`Failed to book appointment: ${appointmentError}`)
    //     }
    //     return () => {
    //         dispatch(clearAppointmentStatus())
    //     }
    // }, [appointmentStatus, appointmentError, dispatch])

    const handleDateSelection = (date: string) => {
        setSelectedDate(date.split('T')[0]);
        setSelectedTime(null)
    };

    const handleTimeSelection = (time: string) => {
        const timePart = time.split(' ')[1];
        console.log("timepart:", timePart);
        
        setSelectedTime(timePart);
    }

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
    };

    const handleSubmit = async () => {
        if (selectedDate && selectedTime && therapistId) {
            const userId = userIdentity || "undefined"

            const slot = new Date(`${selectedDate}T${selectedTime}:00Z`);
            const convenienceFees = 80;
            const totalAmount = (therapist?.fees ?? 0) + convenienceFees;

            const appointmentData = {
                userId,
                therapistId,
                slot,
                totalAmount,
            }

            try {
                navigate(`/payment`, {state: appointmentData});
               
            } catch (error) {
                console.error("Appointment booking failed:", error);
            }
        } else {
            toast.error("Please select a slot and add any necessary notes.");
        }
    };



    const generateHourBlocks = (startTime: string, endTime: string): string[] => {
        const blocks: string[] = [];
        const start = new Date(`1970-01-01T${startTime}:00Z`);
        const end = new Date(`1970-01-01T${endTime}:00Z`);
        let current = new Date(start);

        while (current < end) {
            blocks.push(current.toISOString().substring(11, 16));
            current.setHours(current.getHours() + 1);
        }

        return blocks;
    };


    const filterBookedSlots = (availableSlots: string[], bookedSlots: string[]): string[] => {
        const bookedSet = new Set(bookedSlots.map(slot => new Date(slot).toISOString()));

        return availableSlots.filter(slot => {
            const slotDate = new Date(slot);
            return !bookedSet.has(slotDate.toISOString())
        })
    }


    const getFilteredSlots = (slots: string[], booked: string[]): string[] => {
        const now = new Date();
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(now.getMonth() + 3);

        // const bookedMap = new Map<string, Set<string>>();

        // booked.forEach(bookedSlot => {
        //     const bookedDate = new Date(bookedSlot);
        //     const bookedLocal = new Date(bookedDate.getTime() + (5.5 * 60 * 60 * 1000));

        //     const bookedDateString = bookedLocal.toISOString().split('T')[0];
        //     const bookedHour = bookedLocal.toISOString().substring(11, 16);

        //     if (!bookedMap.has(bookedDateString)) {
        //         bookedMap.set(bookedDateString, new Set<string>());
        //     }
        //     bookedMap.get(bookedDateString)?.add(bookedHour);
        // })

       
        // return slots.filter(slot => {
        //     const slotDate = new Date(slot);
        //     const slotUTC = new Date(slotDate.getTime() + (5.5 * 60 * 60 * 1000));
    
        //     // Log the slot date for debugging
        //     console.log("slotDate:", slotDate, "slotUTC:", slotUTC);
    
        //     // Only consider slots within the next 3 months
        //     if (slotUTC >= now && slotUTC <= threeMonthsLater) {
            
        //         const slotDateString = slotUTC.toISOString().split('T')[0];
        //         const slotHour = slotUTC.toISOString().substring(11, 16);

        //         const isBooked = bookedMap.has(slotDateString) && bookedMap.get(slotDateString)?.has(slotHour);

        //         return !isBooked;                
        //     }
        //     return false;
        // });



        const slotsWithinRange = slots.filter(slot => {
            const slotDate = new Date(slot);
            return slotDate >= now && slotDate <= threeMonthsLater;
        });
    
        // Then, remove booked slots
        return filterBookedSlots(slotsWithinRange, booked);

    };
    

    const filteredSlots = getFilteredSlots(availableSlots, bookedSlots);

    

    

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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{therapist.name}</h2>
                    <p className="text-gray-600 text-sm mb-4">{therapist.email}</p>
                    <p className="text-gray-600 text-sm mb-4">{therapist.professionalExperience} years of experience</p>
                </div>

                {/* Available Slots */}
                <div className="mb-6 w-full">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Slots</h3>

                    {/* Check if there are available slots */}
                    {Array.isArray(filteredSlots) && filteredSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                            {filteredSlots.map((slot: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleDateSelection(slot)}
                                    className={`${
                                        selectedDate === slot.split('T')[0] ? "bg-green-500" : "bg-green-200"
                                    } text-white font-semibold py-2 px-4 rounded-lg`}
                                >
                                    {/* Displaying Date and Time from ISO String */}
                                    {new Date(slot).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div>No available slots</div>
                    )}
                </div>

                <div className="mb-6 w-full">
                    <h3 className="text-xl font-semibold text-green-900 mb-4">Timings</h3>

                    {timings.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {timings.map((timing, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-lg">
                                    <p><strong>Day(s):</strong> {timing.dayOfWeek.join(', ')}</p>
                                    {generateHourBlocks(timing.startTime, timing.endTime).map((block, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleTimeSelection(`${timing.dayOfWeek.join(', ')} ${block}`)}
                                            className={`${
                                                selectedTime ===  block ? "bg-green-500" : "bg-green-200"
                                            } text-white font-semibold py-2 px-4 rounded-lg mb-1 block`}
                                        >
                                            {block}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>No timings available</div>
                   
                    )}
                </div>

                {/* Appointment Notes */}
                <div className="mb-6 w-full">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Notes to Therapist</h3>
                    <textarea
                        value={notes}
                        onChange={handleNotesChange}
                        className="w-full h-32 p-3 border rounded-lg focus:outline-none"
                        placeholder="Add any notes to the therapist (up to 200 words)"
                        maxLength={200}
                    />
                </div>

                {/* Fees and Submit */}
                <div className="flex justify-between items-center mb-6">
    <div className="flex flex-col">
        <div>
            <span className="font-semibold">Fees: </span>
            <span className="text-black-600 font-bold">₹{therapist.fees}</span>
        </div>
        <div>
            <span className="font-semibold">Convenience Fee: </span>
            <span className="text-black-600 font-bold">₹80</span>
        </div>
    </div>

    <button
        onClick={handleSubmit}
        className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
    >
        Submit Appointment
    </button>
</div>

            </div>
        </div>
    );
};

export default SlotManagement;
