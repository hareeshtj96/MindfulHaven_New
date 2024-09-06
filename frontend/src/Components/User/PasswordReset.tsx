import React, { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {PasswordResetSlice} from "../../Redux/Store/Slices/userSlice"
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { useNavigate } from "react-router-dom";


function PasswordReset() {
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [localError, setLocalError] = useState<string | null>(null);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const resetPasswordStatus  = useSelector((state: RootState) => state.user.resetPasswordStatus);

    const handlePasswordReset = (e: FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if(newPassword !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        dispatch(PasswordResetSlice({newPassword, confirmPassword}))
            .unwrap()
            .then((response: any) => {
                console.log("Password reset response:", response);
                if(response.status) {
                    navigate("/login");
                }
            })
            .catch((error: any) => {
                setLocalError(error.message || "An error occured")
            });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>

                <form onSubmit={handlePasswordReset}>
                    {/* New Password Field */}
                    <div className="mb-4">
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="New Password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={resetPasswordStatus === 'loading'}
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={resetPasswordStatus === 'loading'}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-customGreen text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50"
                            disabled={resetPasswordStatus === 'loading'}
                        >
                            {resetPasswordStatus === 'loading' ? "Resetting..." : "Reset Password"}
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

export default PasswordReset;