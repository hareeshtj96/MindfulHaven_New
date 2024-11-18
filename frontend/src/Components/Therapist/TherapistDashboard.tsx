import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTherapistProfit } from '../../Redux/Store/Slices/therapistSlice';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/Store/store"
import { useSelect } from "@material-tailwind/react";
import { Root } from "postcss";



function TherapistDashboard() {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    const therapist = useSelector((state: RootState) => state.therapist.currentTherapist)
    const therapistId = therapist?.therapistId;

    const { userName, mostBookedHour, totalProfit } = useSelector((state: RootState) => state.therapist)


    const handleContinue = () => {
        // Handle the continue button action here
        console.log("Continue button clicked");
        navigate("/therapist/therapist_details", { state: { therapistId } });
    };

    useEffect(() => {
        if (therapistId)
            dispatch(fetchTherapistProfit({ therapistId }))
    }, [dispatch, therapistId])

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md flex flex-col">
        {/* Display therapist data in three big green boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-green-100 p-6 rounded-lg shadow-md min-w-[250px]">
                <h3 className="text-xl font-semibold text-center text-gray-700">Frequently Contacting Client</h3>
                <p className="text-center text-lg text-gray-900 font-bold">{userName}</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-md min-w-[250px]">
                <h3 className="text-xl font-semibold text-center text-gray-700">Most Booked Hour</h3>
                <p className="text-center text-lg text-gray-900 font-bold">{mostBookedHour}:00</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-md min-w-[250px]">
                <h3 className="text-xl font-semibold text-center text-gray-700">Your Total Profit</h3>
                <p className="text-center text-lg text-gray-900 font-bold">₹{totalProfit}</p>
            </div>
        </div>

        {/* Profile update section */}
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
            <p className="text-gray-700">
                Update your profile details here.
            </p>
        </div>

        {/* Continue button container */}
        <div className="w-full flex justify-center">
            <button
                onClick={handleContinue}
                className="bg-green-400 text-center text-white font-bold py-2 px-6 rounded-full hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            >
                Continue
            </button>
        </div>
    </div>
</div>
    );
}

export default TherapistDashboard;
