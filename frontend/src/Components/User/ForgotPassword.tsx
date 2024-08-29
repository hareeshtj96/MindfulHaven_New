import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../Store/Slices/userSlice";
import { RootState, AppDispatch } from "../../../src/Store/store";

function ForgotPassword() {
    const [email, setEmail] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [localError, setLocalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { forgotPasswordStatus, forgotPasswordError, forgotPasswordSuccess } = useSelector((state: RootState) => state.user);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        dispatch(forgotPassword({ email, newPassword, confirmPassword }))
        .unwrap()
        .then(() => {
            setSuccessMessage("Password reset successfully. Redirecting...");
            setTimeout(() => navigate("/login"), 2000);  
        })
        .catch((error) =>  {
            setLocalError(error.message || "An error occurred");
        });
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

                <form onSubmit={handleSubmit}>
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

                    {/* New Password Field */}
                    <div className="mb-4">
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Enter new password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={forgotPasswordStatus === 'loading'}
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {forgotPasswordStatus === 'loading' ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>

                    {/* Error or Success Message */}
                    {(localError || forgotPasswordError) && (
                        <div className="text-red-500 text-center mb-4">{localError || forgotPasswordError}</div>
                    )}
                    {successMessage && (
                        <div className="text-green-500 text-center mb-4">{successMessage}</div>
                    )}

                    {/* Link to Login Page */}
                    <div className="text-center">
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
