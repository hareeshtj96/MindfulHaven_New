import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyForgotPasswordOTP } from "../../Redux/Store/Slices/userSlice"
import { AppDispatch, RootState } from "../../Redux/Store/store";


function ForgotPasswordOtp() {
    const [otp, setOtp] = useState<string>("");
    const [localError, setLocalError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {loading, error} = useSelector((state: RootState) => state.user);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        try {
            const result = await dispatch(verifyForgotPasswordOTP(otp)).unwrap();
            if(result) {
                navigate("/password_Reset");
            }
        } catch (error: any) {
            setLocalError(error || "OTP verification failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Enter your OTP</h2>

                <form onSubmit={handleSubmit}>
                    {/* OTP Input Field */}
                    <div className="mb-4">
                        <input
                            type="text"
                            id="otp"
                            placeholder="Enter OTP"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-customGreen text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>

                    {/* Error Message */}
                    {(localError || error) && (
                        <div className="text-red-500 text-center mb-4">{localError || error}</div>
                    )}

                    {/* Uncomment the below section if you want to add a link to resend OTP */}
                    {/* <div className="text-center">
                        <Link to="/resend-otp" className="text-blue-500 hover:underline">
                            Didn't receive an OTP? Resend
                        </Link>
                    </div> */}
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordOtp;