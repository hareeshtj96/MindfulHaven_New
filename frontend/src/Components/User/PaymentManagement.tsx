import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { paymentMethod, sendPaymentStatus, saveAppointment } from "../../Redux/Store/Slices/userSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PaymentPage = () => {
    const [notes, setNotes] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const appointmentStatus = useSelector((state: RootState) => state.user.appointmentStatus)
    const appointmentError = useSelector((state: RootState) => state.user.appointmentError)
    const appointmentDataState = useSelector((state: RootState) => state.user.appointmentData);
    console.log("appointment data state:", appointmentDataState);
    

    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();
    const { totalAmount, userId, therapistId, slot } = location.state || { totalAmount: 0 };

    // const therapist = useSelector((state: RootState) => {
    //     const therapistList = [
    //       ...(state.user.therapists?.therapists || []),
    //       ...(state.user.familyTherapists?.therapists || []),
    //       ...(state.user.coupleTherapists?.therapists || []),
    //       ...(state.user.individualTherapists?.therapists || [])
    //   ]; 
    
    //     return therapistList.find((t) => t._id === therapistId);
    // });

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
        setIsLoading(true);

        try {
            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded) {
                toast.error("Failed to load Razorpay SDK. Please try again.");
                setIsLoading(false);
                return;
            }

            const initialPaymentStatus = "pending"

            const data = await dispatch(paymentMethod({ therapistId, userId, notes, totalAmount, slot, paymentStatus:initialPaymentStatus })).unwrap();
            const { razorpayOrderId, amount } = data.appointmentData || {};

            if (!razorpayOrderId) {
                toast.error("Error creating Razorpay order. Please try again.");
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
                handler: async function (response: any) {
                    // Handle successful payment here
                    toast.success("Payment successful!");

                    const paymentStatus = "success";
                    const paymentResponse =  await savePaymentToBackend(
                        {
                            razorpayOrderId: response.razorpay_order_id,
                            paymentDetails: response,
                        },
                        therapistId,
                        userId,
                        paymentStatus,
                        slot,
                        totalAmount,
                        notes,
                    );

                    console.log("paymentresponse............", paymentResponse);
                    

                    const paymentId = paymentResponse?.paymentId

                    console.log("payment id:", paymentId);
                    

                    const appointmentData = await dispatch(saveAppointment({ 
                        therapistId, 
                        userId, 
                        slot, 
                        notes,
                        paymentId
                     })).unwrap();

                    console.log("appointment data......:", appointmentData)

                    if (appointmentData.success) {
                        toast.success("Appointment saved successfully!");
                        navigate(`/booking_status/${appointmentDataState._id}`, { state: { paymentDetails: response } });
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
                    ondismiss: async function () {
                        toast.error("Payment process interrupted");

                        const paymentStatus = "failure";
                        await savePaymentToBackend(
                            {
                                razorpayOrderId: razorpayOrderId,
                                paymentDetails: null,
                            },
                            therapistId,
                            userId,
                            paymentStatus,
                            slot,
                            totalAmount,
                            notes
                        )
                        setIsLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

            setIsLoading(false); // Stop loading after the modal opens
        } catch (error) {
            console.error("Payment failed:", error);
            toast.error("Payment failed. Please try again.");
            setIsLoading(false);

            const paymentStatus = "failure";
            await savePaymentToBackend(
                {
                    razorpayOrderId: null,
                    paymentDetails: null,
                },
                therapistId,
                userId,
                paymentStatus,
                slot,
                totalAmount,
                notes,
            );
        }
    };

    const savePaymentToBackend = async (
        paymentData: any,
        therapistId: string,
        userId: string,
        paymentStatus: string,
        slot:Date,
        totalAmount: number,
        notes: string,
    ) => {
        try {
            const { razorpay_order_id } = paymentData;

            const response = await dispatch(
                sendPaymentStatus({
                    therapistId,
                    userId,
                    razorpayOrderId: razorpay_order_id,
                    paymentStatus,
                    paymentDetails: paymentData,
                    slot,
                    totalAmount,
                    notes
                })
            ).unwrap();
            console.log("response from savebackend:.......", response)

           return response;
        } catch (error) {
            toast.info("Payment failed or was interuppted.");
            console.error("Error sending payment status:", error);
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

                <div className="mb-6">
                    <span className="font-semibold">Payment Method: </span>
                    <span className="text-black-600 font-bold">Razorpay</span>
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
