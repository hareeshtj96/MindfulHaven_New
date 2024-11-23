import React, { useEffect, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { useDispatch, useSelector } from 'react-redux';
import 'react-calendar/dist/Calendar.css';
import { RootState, AppDispatch } from '../../Redux/Store/store';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { updateTherapistAvailability, fetchAvailableDetails, cancelAvailableSlot } from '../../Redux/Store/Slices/therapistSlice';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TherapistCalendar: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState<Date | [Date, Date] | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;


    const therapist = useSelector((state: RootState) => state.therapist.currentTherapist);
    const therapistId = therapist?.therapistId;



    const { updatedTimings, booked } = useSelector((state: RootState) => state.therapist.details || { booked: [], timings: [], updatedTimings: [] });

    const totalPages = Math.ceil(updatedTimings.length / itemsPerPage);

    const paginatedTimings = updatedTimings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const onDateChange: CalendarProps['onChange'] = (value) => {
        if (value instanceof Date) {
            setSelectedDate(value);
            setIsCalendarOpen(false);
            generateTimeSlotsForDate(value);
        }
    };

    const generateTimeSlotsForDate = (date: Date) => {
        if (!updatedTimings || updatedTimings.length === 0) {
            setAvailableTimeSlots([]);
            return;
        }

        // Format selected date to match the structure in `updatedTimings`
        const selectedDateString = date.toISOString().split('T')[0];

        // Find matching timing entry for the selected date
        const dayTiming = updatedTimings.find((timing) => timing.date === selectedDateString);

        if (dayTiming) {
            const { startTime, endTime } = dayTiming;
            const slots = generateHourlySlots(startTime, endTime);
            setAvailableTimeSlots(slots);
        } else {
            setAvailableTimeSlots([]);
        }
    };

    const generateHourlySlots = (startTime: string, endTime: string): string[] => {
        const slots: string[] = [];
        const start = new Date(`2024-01-01 ${startTime}`);
        const end = new Date(`2024-01-01 ${endTime}`);

        // Loop from startTime to endTime and push each hourly slot into the slots array
        while (start < end) {
            slots.push(start.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }));
            start.setHours(start.getHours() + 1);
        }

        return slots;
    };


    useEffect(() => {
        if (therapistId) {
            dispatch(fetchAvailableDetails(therapistId));
        }
    }, [dispatch, therapistId]);

    const initialValues = {
        date: '',
        startTime: '',
        endTime: '',
    };

    const validationSchema = Yup.object({
        startTime: Yup.string().required('Start time is required'),
        endTime: Yup.string().required('End time is required'),
    });

    const formatSelectedDate = (): string => {
        if (selectedDate instanceof Date) {
            return selectedDate.toLocaleDateString('en-GB');
        } else if (Array.isArray(selectedDate)) {
            return `${selectedDate[0].toLocaleDateString('en-GB')} - ${selectedDate[1].toLocaleDateString('en-GB')}`;
        }
        return '';
    };

    // Format date to a more readable format
    const formatDate = (isoDateString: string) => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };



    // Generate hourly time blocks
    const generateTimeBlocks = (startTime: string, endTime: string) => {
        const blocks: string[] = [];
        const start = new Date(`2024-01-01 ${startTime}`);
        const end = new Date(`2024-01-01 ${endTime}`);

        while (start < end) {
            blocks.push(start.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }));
            start.setHours(start.getHours() + 1);
        }

        return blocks;
    };

    const CustomConfirmationToast = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div>
          <p className="mb-2">Do you want to delete this slot?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-xs"
            >
              Yes
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-300 px-3 py-1 rounded-md text-xs"
            >
              No
            </button>
          </div>
        </div>
      );


    // Handle slot deletion
    const handleDeleteSlot = (slotId: string, therapistId: string) => {
        toast(
          <CustomConfirmationToast
            onConfirm={async () => {
              try {
                const response = await dispatch(cancelAvailableSlot({ slotId, therapistId }));
                if (response.payload && response.payload.status) {
                  toast.success("Slot deleted successfully!");
                  dispatch(fetchAvailableDetails(therapistId));
                } else {
                  toast.error("Failed to delete slot");
                }
              } catch (error) {
                toast.error("Error deleting slot");
              } finally {
                toast.dismiss();
              }
            }}
            onCancel={() => {
              toast.info("Slot deletion canceled.");
              toast.dismiss(); 
            }}
          />,
          { autoClose: false } 
        );
      };



    const handleSubmit = async (values: { date: string; startTime: string; endTime: string }, resetForm: () => void) => {
        const updatedValues = { ...values, date: formatSelectedDate() };
        try {
            const response = await dispatch(updateTherapistAvailability(updatedValues))
            console.log("response from handle submit:", response);
            if (response.payload && response.payload.status) {
                toast.success("Timings updated successfully!");
                resetForm();
                setSelectedDate(null);
                setAvailableTimeSlots([]);
                if (therapistId)
                    dispatch(fetchAvailableDetails(therapistId))
            } else if (response.payload && !response.payload.status) {
                toast.error(response.payload.message);
            } else {
                toast.error("Failed to update timings")
            }
        } catch (error) {
            toast.error("Failed to update timings.");
        }
    };




    return (
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center min-h-screen p-6 bg-gray-50">

            {/* Left Side: Updated Timings */}
            <div className="flex-1 w-full sm:w-1/2 p-4 bg-white shadow-md rounded-lg mb-6 sm:mb-0 sm:mr-4">
                <h2 className="text-xl font-semibold mb-4">Your Updated Timings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paginatedTimings
                        .slice()
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((timing) => (
                            <div
                                key={timing._id}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-gray-600">
                                        {formatDate(timing.date)}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {timing.slots
                                        .slice()
                                        .sort((a: any, b: any) => {
                                            const timeA = new Date(`1970-01-01T${a.startTime}`).getTime();
                                            const timeB = new Date(`1970-01-01T${b.startTime}`).getTime();
                                            return timeA - timeB
                                        })
                                        .map((slot: any) => (
                                            <div key={slot._id}>

                                                <div className="flex flex-wrap gap-2">
                                                    {generateTimeBlocks(slot.startTime, slot.endTime)
                                                        .filter((time) => {
                                                            const timeISO = `${timing.date.split('T')[0]}T${time}:00.000Z`;
                                                            return !booked.includes(timeISO)
                                                        })
                                                        .map((time, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-green-50 text-blue-600 text-center py-2 px-6 rounded-lg text-xs font-semibold"
                                                            >
                                                                {time}
                                                            </div>
                                                        ))}
                                                    <button
                                                        onClick={() => handleDeleteSlot(slot._id, therapistId ?? '')}
                                                        className="ml-2 bg-red-500 text-white text-xxs px-2 py-1  rounded-md"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>
                {/* Pagination controls*/}
                <div className="flex justify-center mt-4 space-x-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${currentPage === 1 ? "bg-gray-200 text-gray-500" : "bg-green-500 text-white"
                            }`}
                    >
                        Previous
                    </button>
                    <span className='text-sm font-medium text-gray-600'> Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${currentPage === totalPages ? "bg-gray-200 text-gray-500" : "bg-green-500 text-white"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>


            {/* Right Side: Update Availability Form */}
            <div className="flex-1 w-full sm:w-1/2 p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Update your Availability</h2>

                {/* Calendar */}
                {isCalendarOpen && (
                    <div className="absolute z-50 bg-white shadow-xl rounded-lg">
                        <Calendar onChange={onDateChange} value={selectedDate} minDate={new Date()} />
                    </div>
                )}

                {/* Time Slots for Selected Date */}
                {selectedDate && availableTimeSlots.length > 0 && (
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                        <h3 className="font-semibold mb-4">Available Time Slots for {formatSelectedDate()}</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {availableTimeSlots.map((time, index) => (
                                <div
                                    key={index}
                                    className="bg-green-50 p-2 rounded text-center cursor-pointer hover:bg-green-100 transition-colors"
                                >
                                    {time}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        handleSubmit({ ...values, date: formatSelectedDate() }, resetForm);
                    }}
                >
                    {() => (
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <Form className="space-y-4">
                                <div className="mb-4">
                                    <label htmlFor="date" className="block font-medium">
                                        Select Date
                                    </label>
                                    <input
                                        type="text"
                                        id="date"
                                        name="date"
                                        className="mt-2 w-full p-2 border border-gray-300 rounded cursor-pointer"
                                        value={formatSelectedDate()}
                                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                        readOnly
                                    />
                                    <ErrorMessage name="date" component="div" className="text-red-500" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="startTime" className="block font-medium">
                                        Start Time
                                    </label>
                                    <Field
                                        type="time"
                                        id="startTime"
                                        name="startTime"
                                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                                    />
                                    <ErrorMessage name="startTime" component="div" className="text-red-500" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="endTime" className="block font-medium">
                                        End Time
                                    </label>
                                    <Field
                                        type="time"
                                        id="endTime"
                                        name="endTime"
                                        className="mt-2 w-full p-2 border border-gray-300 rounded"
                                    />
                                    <ErrorMessage name="endTime" component="div" className="text-red-500" />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                >
                                    Submit
                                </button>
                            </Form>
                        </div>
                    )}
                </Formik>

                <ToastContainer />
            </div>
        </div>

    );
};

export default TherapistCalendar;