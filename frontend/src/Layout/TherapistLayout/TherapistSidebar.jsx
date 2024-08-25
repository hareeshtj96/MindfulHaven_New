import React, { useState } from "react";
import { FaCalendar, FaUser, FaHistory, FaFileAlt, FaCog } from "react-icons/fa";

function TherapistSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-0 left-0 p-4 ${isOpen ? 'bg-green-400' : 'bg-green-500'} text-white focus:outline-none z-40`}
               
            >
                {isOpen ? 'MH' : 'MH'}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'} bg-green-100 z-30`}
               
            >
                <div className="flex items-center justify-center h-16">
                    <button
                        onClick={toggleSidebar}
                        className="text-white text-2xl focus:outline-none"
                    >
                        {isOpen ? '←' : '→'}
                    </button>
                </div>
                <div className={`flex flex-col items-center ${isOpen ? 'mt-8' : 'mt-4'}`}>
                    <button className="w-full rounded-full bg-white text-gray-700 mb-2 py-2 px-4 hover:bg-gray-200 flex items-center justify-center">
                        <FaCalendar className="inline-block mr-2" />
                        {isOpen && 'Calendar'}
                    </button>
                    <button className="w-full rounded-full bg-white text-gray-700 mb-2 py-2 px-4 hover:bg-gray-200 flex items-center justify-center">
                        <FaUser className="inline-block mr-2" />
                        {isOpen && 'Patients'}
                    </button>
                    <button className="w-full rounded-full bg-white text-gray-700 mb-2 py-2 px-4 hover:bg-gray-200 flex items-center justify-center">
                        <FaHistory className="inline-block mr-2" />
                        {isOpen && 'Session History'}
                    </button>
                    <button className="w-full rounded-full bg-white text-gray-700 mb-2 py-2 px-4 hover:bg-gray-200 flex items-center justify-center">
                        <FaFileAlt className="inline-block mr-2" />
                        {isOpen && 'Reports'}
                    </button>
                    <button className="w-full rounded-full bg-white text-gray-700 mb-2 py-2 px-4 hover:bg-gray-200 flex items-center justify-center">
                        <FaCog className="inline-block mr-2" />
                        {isOpen && 'Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TherapistSidebar;
