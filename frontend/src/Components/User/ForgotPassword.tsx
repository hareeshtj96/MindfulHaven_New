import React, { useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../Redux/Store/Slices/userSlice"
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { useNavigate } from "react-router-dom";


function ForgotPassword() {
    const [email, setEmail] = useState<string>("");
    const [localError, setLocalError] = useState<string | null>(null);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { forgotPasswordStatus } = useSelector((state: RootState) => state.user);

    const handleVerifyClick = (e: FormEvent) => {
        e.preventDefault();

        dispatch(forgotPassword(email ))
        .unwrap()
        .then((response) => {
            if(response.status) {
                navigate('/forgotPasswordOtp');
            }
        })
        .catch((error) => {
            setLocalError(error.message || "An error occurred");
        });
    };

   

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

                <form onSubmit={handleVerifyClick}>
                    {/* Email Field */}
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={forgotPasswordStatus === 'loading'}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-customGreen text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50"
                            disabled={forgotPasswordStatus === 'loading'}
                        >
                            {forgotPasswordStatus === 'loading' ? "Verifying..." : "Verify Email"}
                        </button>
                    </div>

                    {/* Error Message */}
                    {localError && (
                        <div className="text-red-500 text-center mb-4">{localError}</div>
                    )}

                </form>

                
            </div>
        </div>
    );
}

export default ForgotPassword;
