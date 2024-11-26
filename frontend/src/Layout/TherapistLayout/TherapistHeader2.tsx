import React, { useEffect, useState } from "react";
import { FaUserCircle, FaBell } from 'react-icons/fa';
import logoImage from '../../../Public/banner/MindfulHaven_logo.png';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/Store/Slices/therapistSlice"
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { fetchTherapistNotifications, markAllTherapistNotificationsAsRead } from "../../Redux/Store/Slices/therapistSlice";

function TherapistHeader2() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNoticationOpen] = useState(false);
    const hasFetchedTherapistNotifications = useSelector((state: RootState) => state.therapist.hasFetchedTherapistNotifications)
    const therapistNotificationsRead = useSelector((state: RootState) => state.therapist.notificationsRead)

    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();



    const therapist = useSelector((state: RootState) => state.therapist.currentTherapist);
    const therapistId = therapist?.therapistId;

    const { therapistNotifications } = useSelector((state: RootState) => state.therapist)

    const today = new Date().toISOString().split('T')[0];

    // Filter today's notifications
    const todayNotifications = therapistNotifications.filter(notification => {
        return new Date(notification.slot).toISOString().split('T')[0] === today;
    });


    useEffect(() => {
        if (!therapist) {
            navigate('/therapist/therapist_login')
        }
    }, [therapist]);

    useEffect(() => {
        if (therapistId && !hasFetchedTherapistNotifications) {
            dispatch(fetchTherapistNotifications(therapistId))
        }
    }, [dispatch, therapistId, hasFetchedTherapistNotifications]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleNotifications = () => setIsNoticationOpen(!isNotificationOpen);

    const handleLogout = () => {
        localStorage.removeItem('therapistToken');
        dispatch(logout())
        navigate("/therapist/therapist_login");
    };


    // Mark all notifications as read
    const handleMarkAllAsRead = () => {
        dispatch(markAllTherapistNotificationsAsRead())
    };

    const isFutureAppointment = (slot: string) => {
        const appointmentDate = new Date(slot);
        return appointmentDate > new Date();
    };

    return (
        <header className="bg-headercolor shadow-md sticky top-0 z-20">
            <div className="container mx-auto flex justify-between items-center py-2 px-4 md:px-6">
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <img src={logoImage} alt="MindfulHaven Logo" className="h-12 w-auto md:h-20" />
                    <div
                        onClick={() => navigate('/therapist/therapist_dashboard')}
                        className="text-lg md:text-2xl font-bold text-btncolor whitespace-nowrap cursor-pointer"
                    >
                        MindfulHaven
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Notifications Bell */}
                    <div className="relative">
                        <button onClick={toggleNotifications} className="text-btncolor relative">
                            <FaBell className="text-2xl" />
                            {todayNotifications.length > 0 && !therapistNotificationsRead && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {todayNotifications.length}
                                </span>
                            )}
                        </button>

                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
                                <div className="px-4 py-2 border-b flex justify-between items-center">
                                    <span className="font-medium text-gray-800">Notifications</span>
                                    <button onClick={handleMarkAllAsRead} className="text-sm text-blue-500 hover:underline">Mark all as read</button>
                                </div>
                                {todayNotifications.length > 0 ? (
                                    todayNotifications.map((notification) => (
                                        <div key={notification._id} className="px-4 py-2 text-gray-800">
                                            <span>
                                                {isFutureAppointment(notification.slot)
                                                    ? `You have an appointment with ${notification.userName} today at ${new Date(notification.slot).toUTCString()}`
                                                    : `You had an appointment with ${notification.userName} today at ${new Date(notification.slot).toUTCString()}`
                                                }
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-800">No appointments today.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
                            <FaUserCircle className="h-8 w-8 text-btncolor" />
                            <span className="hidden md:inline">{therapist?.name || 'therapist'}</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                <Link to="/therapist/therapist_profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default TherapistHeader2;
