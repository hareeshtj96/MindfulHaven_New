import React, { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resendOtp } from "../../Redux/Store/Slices/userSlice"
import { AppDispatch, RootState } from "../../Redux/Store/store";


function OtpVerification() {
    const [otp, setOtp] = useState<string>("");
    const [localError, setLocalError] = useState<string | null>(null);
    const [timer, setTimer] = useState<number>(10);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {loading, error} = useSelector((state: RootState ) => state.user);

    useEffect(() => {
        let countdown: NodeJS.Timeout | null = null;
        if(timer > 0) {
            countdown = setTimeout(() => setTimer(timer -1), 1000);
        } else {
            setIsResendDisabled(false);
        }
        return () => {
            if(countdown) {
                clearTimeout(countdown);
            }
        }
    }, [timer]);

    useEffect(() => {
        setTimer(10);
        setIsResendDisabled(true);
    },[]);



    const handleResendOtp = async () => {
        setIsResendDisabled(true);
        setTimer(10);

        try {
            const token = localStorage.getItem("otpToken");
            if(token) {
                const result = await dispatch(resendOtp()).unwrap();
                localStorage.setItem("otpToken", result.token);
                alert(result.message);
            } else {
                setLocalError("Invalid token");
            }
        } catch (error) {
            setLocalError("Error resending OTP");
        }
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError(null)
        
        try {

            const result = await dispatch(verifyOtp(otp)).unwrap();
            if(result) {
                navigate("/login");
            }
        } catch(error: any) {
            setLocalError(error || "OTP verification failed")
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">OTP Verification</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input type="text" id="otp" placeholder="Enter OTP" className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                         value={otp} onChange={(e) => setOtp(e.target.value)} required disabled={loading} />
                    </div>

                    <div className="mb-6">
                        <button type="submit" className="w-full bg-customGreen text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                    </div>

                    {(localError || error) && (
                        <div className="text-red-500 text-center mb-4">{localError || error}</div>
                    )}

                    <div className="text-center">
                        <button type="button" className={`text-blue-500 hover:underline ${isResendDisabled ? "opacity-50 cursor-not-allowed": ""}`} onClick={handleResendOtp} disabled={isResendDisabled}>
                            Resend OTP {isResendDisabled ? `in ${timer}s` : ""}

                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default OtpVerification;