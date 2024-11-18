import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { paymentMethod, sendPaymentStatus, saveAppointment, walletPayment } from "../../Redux/Store/Slices/userSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PaymentPage = () => {
    const [notes, setNotes] = useState<string>("");
    const [paymentOption, setPaymentOption] = useState<string>("Razorpay"); 
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const appointmentDataState = useSelector((state: RootState) => state.user.appointmentData);

    const state = useSelector((state:RootState) => state.user)
    console.log("state in payment:", state)

    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();
    const { totalAmount, userId, therapistId, slot } = location.state || { totalAmount: 0 };

    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => reject(false);
            document.body.appendChild(script);
        });
    };

    const handleProceedToPay = async () => {
        if (!therapistId || !userId) {
            toast.error("Therapist ID or user ID is missing");
            return;
        }

        if (paymentOption === "Wallet") {
            handleWalletPayment();
        } else if (paymentOption === "Razorpay") {
            await handleRazorpayPayment();
        }
    };

    const handleWalletPayment = async () => {
        try {
            setIsLoading(true);

            
            const paymentResponse = await dispatch(walletPayment({
                therapistId,
                userId,
                slot,
                totalAmount,
                notes
        })).unwrap() 

            console.log("payment response wallet:", paymentResponse)

            if (paymentResponse.success) {
                if (paymentResponse.appointmentData?.status) {
                    toast.success("Wallet payment successful! Appointment booked.");
                    navigate(`/booking_status/${paymentResponse.appointmentData.data._id}`, {
                        state: { paymentDetails: { method: "Wallet" } }
                    });
                } else {
                   
                    toast.error(paymentResponse.appointmentData.message || "Payment failed. Please try again.");
                }
            } else {
                toast.error("Failed to process the payment. Please try again.");
            }
        } catch (error) {
            toast.error("Wallet payment failed. Please try again.");
            console.error("Wallet payment error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRazorpayPayment = async () => {
        try {
            setIsLoading(true);

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error("Failed to load Razorpay SDK. Please try again.");
                setIsLoading(false);
                return;
            }

            const initialPaymentStatus = "pending";

            const data = await dispatch(paymentMethod({ therapistId, userId, notes, totalAmount, slot, paymentStatus: initialPaymentStatus })).unwrap();

            const { razorpayOrderId, amount, reserveAppointment } = data.appointmentData || {};
            if (!razorpayOrderId) {
                toast.error("Error creating Razorpay order. Please try again.");
                setIsLoading(false);
                return;
            }

            if (!reserveAppointment.status) {
                toast.error("Slot is already booked");
                setIsLoading(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "your_key_id",
                amount: amount,
                name: "MindfulHaven",
                description: "Payment for therapy session",
                image: "/your_logo.png",
                order_id: razorpayOrderId,
                handler: async (response: any) => {
                    const paymentStatus = "success";
                    const paymentResponse = await savePaymentToBackend(
                        {
                            razorpayOrderId: response.razorpay_order_id,
                            paymentDetails: response,
                        },
                        therapistId,
                        userId,
                        paymentStatus,
                        slot,
                        totalAmount,
                        notes
                    );

                    const paymentId = paymentResponse?.paymentId;

                    const appointmentData = await dispatch(
                        saveAppointment({
                            therapistId,
                            userId,
                            slot,
                            notes,
                            paymentId,
                        })
                    ).unwrap();

                    if (appointmentData.success) {
                        toast.success("Payment successful! Appointment booked.");
                        navigate(`/booking_status/${appointmentDataState?._id}`, { state: { paymentDetails: response } });
                    } else {
                        toast.error("Failed to save appointment. Please try again.");
                    }
                },
                notes: {
                    address: "Therapy booking",
                },
                theme: {
                    color: "#3399cc",
                },
                modal: {
                    ondismiss: () => {
                        toast.error("Payment process interrupted");
                        setIsLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error("Payment failed. Please try again.");
            console.error("Payment error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const savePaymentToBackend = async (
        paymentData: any,
        therapistId: string,
        userId: string,
        paymentStatus: string,
        slot: Date,
        totalAmount: number,
        notes: string
    ) => {
        try {
            const response = await dispatch(
                sendPaymentStatus({
                    therapistId,
                    userId,
                    razorpayOrderId: paymentData.razorpayOrderId,
                    paymentStatus,
                    paymentDetails: paymentData,
                    slot,
                    totalAmount,
                    notes,
                })
            ).unwrap();
            return response;
        } catch (error) {
            toast.error("Error saving payment status.");
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Payment</h2>

                <div className="mb-4">
                    <span className="font-semibold">Total Amount: </span>
                    <span className="text-black-600 font-bold">₹{totalAmount}</span>
                </div>

                <div className="mb-4">
                    <label className="font-semibold mb-2 block">Select Payment Method:</label>
                    <select
                        value={paymentOption}
                        onChange={(e) => setPaymentOption(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                    >
                        <option value="Razorpay">Razorpay</option>
                        <option value="Wallet">Wallet</option>
                    </select>
                </div>

                <button
                    onClick={handleProceedToPay}
                    className={`bg-green-500 text-white font-semibold py-2 px-4 rounded-lg w-full ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : "Proceed to Pay"}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
