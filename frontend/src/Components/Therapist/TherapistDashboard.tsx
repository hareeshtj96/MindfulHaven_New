import React from "react";
import { useNavigate } from "react-router-dom";

interface TherapistDashboardProps {
    therapistId: string;
}

function TherapistDashboard({ therapistId }: TherapistDashboardProps) {
    const navigate = useNavigate();

    const handleContinue = () => {
        // Handle the continue button action here
        console.log("Continue button clicked");
        navigate("/therapist/therapist_details", { state: { therapistId }});
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Great Progress</h2>
                <p className="text-lg text-center mb-6">
                    Your profile is just a few steps away from going live.
                </p>
                <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
                    <p className="text-gray-700">
                        Update your profile details to complete the setup.
                    </p>
                </div>
                <button
                    onClick={handleContinue}
                    className="w-full bg-green-400 text-white font-bold py-2 px-4 rounded-full hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default TherapistDashboard;
