import React, { useEffect, useState } from "react";
import { FaUserCircle } from 'react-icons/fa'; 
import logoImage from '../../../Public/banner/MindfulHaven_logo.png';
import { useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/Store/Slices/therapistSlice"
import { RootState, AppDispatch } from "../../Redux/Store/store";

function TherapistHeader2() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate(); 
    const dispatch: AppDispatch = useDispatch();

    const therapist = useSelector((state: RootState) => state.therapist.therapist);

    console.log(therapist,"tyyt");
    

    useEffect(() => {
        if(!therapist) {
            navigate('/therapist/therapist_login')
        }
    }, [therapist]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        console.log("inside handle logout")
        localStorage.removeItem('therapistToken');
        dispatch(logout())
        navigate("/therapist/therapist_login");
    };

    return (
        <header className="bg-headercolor shadow-md sticky top-0 z-20">
            <div className="container mx-auto flex justify-between items-center py-2 px-4 md:px-6">
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <img src={logoImage} alt="MindfulHaven Logo" className="h-12 w-auto md:h-20" />
                    <div className="text-lg md:text-2xl font-bold text-btncolor whitespace-nowrap">MindfulHaven</div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
                            <FaUserCircle className="h-8 w-8 text-btncolor" />
                            <span className="hidden md:inline">{therapist?.name || 'therapist'}</span>
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
    );
}

export default TherapistHeader2;
