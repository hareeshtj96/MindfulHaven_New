import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logoImage from '../../../Public/banner/MindfulHaven_logo.png';
import { FaUserCircle } from 'react-icons/fa';
import { logoutUser } from "../../Redux/Store/Slices/userSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";

function DashboardHeader() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const user = useSelector((state: RootState) => state.user.user);

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
    }

    return (
        <>
            <header className="bg-headercolor shadow-md sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center py-2 px-4 md:px-6">

                    <div className="flex items-center space-x-2 flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
                        <img src={logoImage} alt="MindfulHaven Logo" className="h-12 w-auto md:h-20" />
                        <div className="text-lg md:text-2xl font-bold text-btncolor whitespace-nowrap">MindfulHaven</div>
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <button className="md:hidden text-btncolor" onClick={toggleSidebar}>
                        ☰
                    </button>

                    {/* Navigation Menu */}
                    <nav
                        className={`fixed top-0 left-0 w-full h-full bg-headercolor z-40 transform ${
                            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } transition-transform duration-200 ease-in-out md:static md:transform-none md:flex md:items-center md:space-x-8 ml-auto font-semibold`}>
                        <div className={`flex flex-col justify-center ${isSidebarOpen ? 'items-center' : 'items-start'} h-full md:flex-row md:h-auto md:items-center md:space-x-8 md:ml-auto`}>
                            {/* Close button only visible on mobile */}
                            <button
                                className="absolute top-4 right-4 text-btncolor md:hidden"
                                onClick={toggleSidebar}
                            >
                                ✕
                            </button>
                            <Link to="/dashboard" className="text-btncolor py-2 md:py-0 text-right">
                            Dashboard
                            </Link>
                            
                            <Link to="/sessions" className="text-btncolor py-2 md:py-0 text-right">
                            Sessions
                            </Link>
                           
                            <a href="" className="text-btncolor py-2 md:py-0 text-right">
                                Need help? Call us at 9546839021
                            </a>

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
        </>
    );
}

export default DashboardHeader;
