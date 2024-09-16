import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { fetchUserProfile } from "../../Redux/Store/Slices/userSlice";

const UserProfile = () => {
    const dispatch: AppDispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user.user);
    const loading = useSelector((state: RootState) => state.user.loading);
    const error = useSelector((state: RootState) => state.user.error);

    useEffect(() => {
        dispatch(fetchUserProfile());
    },[dispatch]);

    if(loading) {
        return <div className="text-center mt-8">Loading...</div>
    }

    if(error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>
    }

    if(!user) {
        return <div className="text-center mt-8">No user data available</div>
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex flex-col items-center">
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                    <p className="text-gray-600 text-sm mb-4">{user.email}</p>

                    <div className="w-full border-t border-gray-200 pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Information</h3>
                        <div className="flex items-center text-gray-700">
                            <span className="font-medium mr-2">Phone:</span>
                            <span>{user.mobile}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;