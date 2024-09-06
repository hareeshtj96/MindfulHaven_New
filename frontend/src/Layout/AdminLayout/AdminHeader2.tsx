import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUser } from 'react-icons/fa'; 
import logoImage from '../../../Public/banner/MindfulHaven_logo.png';
import {logout} from '../../Redux/Store/Slices/adminSlice'
import { RootState, AppDispatch } from "../../Redux/Store/store";

function AdminHeader2() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const {admin, token} = useSelector((state: RootState) => state.admin);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const handleLogout = () => {
        dispatch(logout())
        navigate("/admin/admin_login");
    };

    return (
        <header className="bg-headercolor shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-2 px-4 md:px-6">
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <img src={logoImage} alt="MindfulHaven Logo" className="h-12 w-auto md:h-20" />
                    <div className="text-lg md:text-2xl font-bold text-btncolor whitespace-nowrap">MindfulHaven</div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="relative">
                        <FaBell className="h-6 w-6 text-btncolor" />
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            3
                        </span>
                    </button>
                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
                            <FaUser className="h-6 w-6 text-btncolor" />
                            {token && admin && (
                                <span className="ml-2 text-gray-700 font-semibold">Admin</span>
                            )}
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
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
    )
}

export default AdminHeader2;
