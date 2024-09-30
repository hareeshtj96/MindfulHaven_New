import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalAmount, paymentMethod } = location.state || { totalAmount: 0, paymentMethod: "N/A" };

    const handleProceedToPay = () => {
        // Proceed with payment logic (e.g., Razorpay integration)
        toast.success("Proceeding to Payment Gateway...");
        // navigate("/payment");
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
                    <span className="text-black-600 font-bold">{paymentMethod}</span>
                </div>

                <button
                    onClick={handleProceedToPay}
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg w-full"
                >
                    Proceed to Pay
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
