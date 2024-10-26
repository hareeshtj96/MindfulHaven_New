import React, { useState } from "react";
import { FaCalendar, FaUser, FaHistory, FaFileAlt, FaCog } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../Redux/Store/store";

function TherapistSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const therapist = useSelector((state: RootState) => state.therapist.currentTherapist);
    const therapistId = therapist?.therapistId
    console.log("therpist id:", therapistId);
    
    const navigate = useNavigate()

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigate = () => {
        navigate(`/therapist/therapist_bookings/${therapistId}`);
    }
    const handleCalendar = () => {
        navigate(`/therapist/therapist_Calendar`)
    }

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-0 left-4 p-2 ${isOpen ? 'bg-green-400' : 'bg-green-500'} text-white focus:outline-none z-40 rounded-full`}
               
            >
                {isOpen ? 'MH' : 'MH'}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-green-100 z-30 shadow-lg`}
            >
                <div className="flex items-center justify-center h-16 p-4 bg-green-500">
                    <button
                        onClick={toggleSidebar}
                        className="text-white text-2xl focus:outline-none"
                    >
                        {isOpen ? '←' : '→'}
                    </button>
                </div>
                <div className={`flex flex-col items-center mt-8`}>
                    <button onClick={handleCalendar} className="w-full rounded-full bg-white text-gray-700 mb-2 py-2 px-4 hover:bg-gray-200 flex items-center justify-center">
                        <FaCalendar className="inline-block mr-2" />
                        {isOpen && 'Update Availability'}
                    </button>
                    {/* <button className="w-full rounded-full bg-white text-gray-700 mb-2 py-2 px-4 hover:bg-gray-200 flex items-center justify-center">
                        <FaUser className="inline-block mr-2" />
                        {isOpen && 'Patients'}
                    </button> */}
                    <button onClick={handleNavigate} className="w-full rounded-full bg-white text-gray-700 mb-2 py-2 px-4 hover:bg-gray-200 flex items-center justify-center">
                        <FaHistory className="inline-block mr-2" />
                        {isOpen && 'Bookings'}
                    </button>
                    {/* <button className="w-full rounded-full bg-white text-gray-700 mb-2 py-2 px-4 hover:bg-gray-200 flex items-center justify-center">
                        <FaFileAlt className="inline-block mr-2" />
                        {isOpen && 'Reports'}
                    </button> */}
                    {/* <button className="w-full rounded-full bg-white text-gray-700 mb-2 py-2 px-4 hover:bg-gray-200 flex items-center justify-center">
                        <FaCog className="inline-block mr-2" />
                        {isOpen && 'Settings'}
                    </button> */}
                </div>
            </div>

            {isOpen && (
                <div
                className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
                onClick={toggleSidebar}
                ></div>
            )}

        </div>
    );
}

export default TherapistSidebar;
