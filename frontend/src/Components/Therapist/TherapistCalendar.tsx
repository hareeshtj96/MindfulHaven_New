import React, { useEffect, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { useDispatch, useSelector } from 'react-redux';
import 'react-calendar/dist/Calendar.css';
import { RootState, AppDispatch } from '../../Redux/Store/store';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { updateTherapistAvailability, fetchAvailableDetails } from '../../Redux/Store/Slices/therapistSlice';
import * as Yup from 'yup'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TherapistCalendar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | [Date, Date] | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  const therapist = useSelector((state: RootState) => state.therapist.currentTherapist);
  const therapistId = therapist?.therapistId;

  const { booked, timings, availableSlots } = useSelector((state: RootState) => state.therapist.details || { booked: [], timings: [], availableSlots: [] });

  const onDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setIsCalendarOpen(false);
      generateTimeSlotsForDate(value);
    }
  };

  const generateTimeSlotsForDate = (date: Date) => {
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }); // Get the day of the week
    const dayTiming = timings.find(timing => timing.dayOfWeek.includes(dayOfWeek)); // Find the matching day
    
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
    start.setHours(start.getHours() + 1); // Increment time by 1 hour
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

  const handleSubmit = async (values: { date: string; startTime: string; endTime: string }, resetForm: () => void) => {
    const updatedValues = { ...values, date: formatSelectedDate() };
    try {
      const response = await dispatch(updateTherapistAvailability(updatedValues)).unwrap();
      if (response) {
        toast.success("Timings updated successfully!");
        resetForm();
        setSelectedDate(null);
        setAvailableTimeSlots([]);
      } else {
        toast.error("Failed to update timings.");
      }
    } catch (error) {
      toast.error("Failed to update timings.");
    }
  };

  const renderAvailableSlots = () => {
    const today = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);

    return availableSlots
      .filter((slot) => {
        const slotDate = new Date(slot);
        return slotDate >= today && slotDate <= threeMonthsLater;
      })
      .map((slot, index) => {
        const slotDate = new Date(slot);
        const isBooked = booked.includes(slot);

        const startTime = new Date(slotDate.setHours(slotDate.getHours()));
        const endTime = new Date(slotDate.setHours(slotDate.getHours() + 1));

        const formattedDate = startTime.toLocaleDateString('en-GB');
        const formattedStartTime = startTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        const formattedEndTime = endTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })

        return (
          <div
            key={index}
            className={`p-4 m-2 max-w-xs w-full rounded-lg shadow-md
              ${isBooked ? 'bg-gray-400 text-white' : 'bg-green-100 text-gray-800'}
              cursor-pointer hover:shadow-lg transition-shadow duration-300`}
          >
            <h3 className='text-lg font-semibold mb-2'>{formattedDate}</h3>
            <p className='text-sm mb-1'>{formattedStartTime} - {formattedEndTime}</p>
            <p className={`text-sm ${isBooked ? 'text-white' : 'text-gray-600'}`}>
              {isBooked ? 'Booked' : 'Available'}
            </p>
          </div>
        );
      });
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen p-6">
      {/* Available Slots Section */}
      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-2xl font-bold mb-6">Available Slots</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderAvailableSlots()}
        </div>
      </div>

      {/* Update Availability Form */}
      <div className="w-full max-w-md mb-12">
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