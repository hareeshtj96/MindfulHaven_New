import React, { useState } from "react";
import { FaCalendar, FaHistory, FaBars, FaTimes, } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/Store/store";

function TherapistSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const therapist = useSelector((state: RootState) => state.therapist.currentTherapist);
    const therapistId = therapist?.therapistId;

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigate = () => {
        navigate(`/therapist/therapist_bookings/${therapistId}`);
    };

    const handleCalendar = () => {
        navigate(`/therapist/therapist_Calendar`);
    };

    return (
        <div className="relative">
        {/* Hamburger Button (when sidebar is closed) */}
        {!isOpen && (
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 p-3 rounded-full shadow-lg bg-green-200 text-white focus:outline-none z-40"
            >
                <FaBars />
            </button>
        )}

        {/* Sidebar */}
        <div
            className={`fixed top-0 left-0 h-full bg-gradient-to-b from-green-500 to-green-300 text-white w-72 transition-transform duration-300 ease-in-out transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } shadow-xl z-30`}
        >
            {/* Close Button (inside sidebar, positioned to the right) */}
            {isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white focus:outline-none"
                >
                    <FaTimes />
                </button>
            )}

            {/* Profile Section */}
            <div className="flex items-center justify-start p-4 space-x-4 bg-green-600">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                    {therapist?.name?.[0] || "T"}
                </div>
                <div>
                    <h2 className="text-lg font-bold">{therapist?.name || "Therapist"}</h2>
                    <p className="text-sm">{therapist?.email || "example@mail.com"}</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 space-y-4 px-4">
                <button
                    onClick={handleCalendar}
                    className="flex items-center space-x-3 bg-white text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 shadow-lg w-full"
                >
                    <FaCalendar />
                    <span>Update Availability</span>
                </button>
                <button
                    onClick={handleNavigate}
                    className="flex items-center space-x-3 bg-white text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 shadow-lg w-full"
                >
                    <FaHistory />
                    <span>View Bookings</span>
                </button>
            </div>
        </div>

        {/* Sidebar Overlay */}
        {isOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-20"
                onClick={toggleSidebar}
            ></div>
        )}
    </div>
    );
}

export default TherapistSidebar;
