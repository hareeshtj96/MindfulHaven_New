import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logoImage from '../../../Public/banner/MindfulHaven_logo.png';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { logoutUser } from "../../Redux/Store/Slices/userSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { fetchUserNotifications, markAllNotificationsAsRead } from "../../Redux/Store/Slices/userSlice";

function DashboardHeader() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNoticationOpen] = useState(false);
    const hasFetchedNotifications = useSelector((state: RootState) => state.user.hasFetchedNotifications)
    const notificationsRead = useSelector((state:RootState) => state.user.notificationsRead);

    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.userId;

    const { userNotifications } = useSelector((state: RootState) => state.user)

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];

    // Filter today's notifications
    const todayNotifications = (userNotifications || []).filter(notification => {
        return new Date(notification.slot).toISOString().split('T')[0] === today;
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user]);

    useEffect(() => {
        if (userId && !hasFetchedNotifications) {
            dispatch(fetchUserNotifications(userId));
        }
    }, [dispatch, userId, hasFetchedNotifications]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(!isDropdownOpen);
    },[isDropdownOpen]);

    const toggleNotifications = () => setIsNoticationOpen(!isNotificationOpen);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        dispatch(logoutUser());
        navigate('/');
    };

    const handleLogoClick = () => {
        navigate('/dashboard');
    };

    const handleProfileClick = () => {
        navigate('/user_profile');
    };

    // Mark all notifications as read
    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationsAsRead()) 
    };

    const isFutureAppointment = (slot: string) => {
        const appointmentDate = new Date(slot);
        return appointmentDate > new Date();
    };

    return (
        <header className="bg-headercolor shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-2 px-4 md:px-6">
                <div className="flex items-center space-x-2 flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
                    <img src={logoImage} alt="MindfulHaven Logo" className="h-12 w-auto md:h-20" />
                    <div className="text-lg md:text-2xl font-bold text-btncolor whitespace-nowrap">MindfulHaven</div>
                </div>

                <button className="md:hidden text-btncolor" onClick={toggleSidebar}>
                    ☰
                </button>

                <nav className={`fixed top-0 left-0 w-full h-full bg-headercolor z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:static md:transform-none md:flex md:items-center md:space-x-8 ml-auto font-semibold`}>
                    <div className={`flex flex-col justify-center ${isSidebarOpen ? 'items-center' : 'items-start'} h-full md:flex-row md:h-auto md:items-center md:space-x-8 md:ml-auto`}>
                        <button className="absolute top-4 right-4 text-btncolor md:hidden" onClick={toggleSidebar}>
                            ✕
                        </button>
                        <Link to="/dashboard" className="text-btncolor py-2 md:py-0 text-right">Dashboard</Link>
                        <Link to="/sessions" className="text-btncolor py-2 md:py-0 text-right">Sessions</Link>
                        <a href="" className="text-btncolor py-2 md:py-0 text-right">Need help? Call us at 9546839021</a>

                        {/* Notifications Bell */}
                        <div className="relative">
                            <button onClick={toggleNotifications} className="text-btncolor relative">
                                <FaBell className="text-2xl" />
                                {todayNotifications.length > 0 && !notificationsRead && (
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
                                                        ? `You have an appointment with ${notification.therapistName} today at ${new Date(notification.slot).toUTCString()}`
                                                        : `You had an appointment with ${notification.therapistName} today at ${new Date(notification.slot).toUTCString()}`
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

                        <div className="relative">
                            <button onClick={toggleDropdown} className="text-btncolor py-2 md:py-0 flex items-center space-x-2">
                                <FaUserCircle className="text-2xl" />
                                <span className="hidden md:inline">{user?.name || 'User'}</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                                    <button onClick={handleProfileClick} className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</button>
                                    <button onClick={handleLogOut} className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default React.memo(DashboardHeader);
