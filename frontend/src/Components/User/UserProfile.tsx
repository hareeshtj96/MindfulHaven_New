import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { fetchUserProfile } from "../../Redux/Store/Slices/userSlice";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const UserProfile = () => {
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();

    const user = useSelector((state: RootState) => state.user.user);

    const loading = useSelector((state: RootState) => state.user.loading);
    const error = useSelector((state: RootState) => state.user.error);

    if(loading) {
        return <div className="text-center mt-8">Loading...</div>
    }

    if(error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>
    }

    if(!user) {
        return <div className="text-center mt-8">No user data available</div>
    }

    const isBasicDetails = location.pathname === "/user_profile/basicDetails" || location.pathname === "/user_profile";

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 md:p-8">
            {/* Content container: Centered and limited width */}
            <div className="flex flex-col md:flex-row w-full max-w-5xl space-x-6 md:space-y-0 md:space-x-6">
                {/* Left side: Tab Navigation (in a separate box) */}
                <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/4 sticky top-8 self-start">
                    <nav className="space-y-4">
                        <NavLink
                            to="/user_profile/basicDetails"
                            className={({ isActive }) =>
                                isActive
                                    ? "block w-full text-white bg-green-600 py-2 px-4 rounded-md text-center"
                                    : "block w-full text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md text-center"
                            }
                        >
                            Basic Details
                        </NavLink>

                        <NavLink
                            to="/user_profile/changePassword"
                            className={({ isActive }) =>
                                isActive
                                    ? "block w-full text-white bg-green-600 py-2 px-4 rounded-md text-center"
                                    : "block w-full text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md text-center"
                            }
                        >
                            Change Password
                        </NavLink>

                        <NavLink
                            to="/user_profile/wallet"
                            className={({ isActive }) =>
                                isActive
                                    ? "block w-full text-white bg-green-600 py-2 px-4 rounded-md text-center"
                                    : "block w-full text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md text-center"
                            }
                        >
                            Wallet
                        </NavLink>
                    </nav>
                </div>

                {/* Right side: User details and outlet (in a separate box) */}
                <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4">
                    <div className={`${isBasicDetails ? 'mb-6' : 'mb-0'}`}>
                        {isBasicDetails && (
                            <div className="flex flex-col items-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                                <p className="text-gray-600 text-sm mb-4">{user.email}</p>
                                <div className="w-full border-t border-gray-200 pt-4">
                                    <div className="flex items-center text-gray-700">
                                        <span className="font-medium mr-2">Phone:</span>
                                        <span>{user.mobile}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Nested Routes Content */}
                    <div className={`${isBasicDetails ? 'mt-4' : 'mt-0'}`}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;