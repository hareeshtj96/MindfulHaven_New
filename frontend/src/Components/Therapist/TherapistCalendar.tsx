import React, { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'; // for validation

const TherapistCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | [Date, Date] | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const onDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setIsCalendarOpen(false); 
    }
  };

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
      return selectedDate.toDateString();
    } else if (Array.isArray(selectedDate)) {
      return `${selectedDate[0].toDateString()} - ${selectedDate[1].toDateString()}`;
    }
    return '';
  };

  return (
    <div className="relative flex flex-col items-center h-screen p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-10">Update your Availability</h1>

      {/* Calendar at the top that can be opened/closed */}
      {isCalendarOpen && (
        <div className="absolute top-20 z-50">
          <Calendar onChange={onDateChange} value={selectedDate} minDate={new Date()} />
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log({ ...values, date: selectedDate });
          alert('Form submitted successfully!');
        }}
      >
        {() => (
          <div className="w-full max-w-md">
            {/* Card Wrapper */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <Form className="space-y-4">
                <div className="mb-4">
                  {/* Date Field */}
                  <label htmlFor="date" className="block font-medium">
                    Select Date
                  </label>
                  <input
                    type="text"
                    id="date"
                    name="date"
                    className="mt-2 w-full p-2 border border-gray-300 rounded"
                    value={formatSelectedDate()} // Call the function here
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)} // Toggle calendar visibility
                    readOnly
                  />
                  <ErrorMessage name="date" component="div" className="text-red-500" />
                </div>

                <div className="mb-4">
                  {/* Start Time Field */}
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
                  {/* End Time Field */}
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

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full p-3 bg-green-300 text-white rounded hover:bg-green-400"
                >
                  Submit
                </button>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default TherapistCalendar;
