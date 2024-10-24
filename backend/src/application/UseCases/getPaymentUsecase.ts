
import Razorpay from 'razorpay';
import { ResponseMessages } from '../../utils/httpStatusCode';

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

  // Initialize Razorpay instance
 const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
});


  const executeFunction = async ({ therapistId, userId, slot, notes, totalAmount }: any) => {
    try {
    
      if (!therapistId || !userId || !totalAmount) {
        throw new Error("Missing required payment details.");
      }
      console.log("therapist ID .........", therapistId);

      // Create an order with Razorpay
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, 
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: true,
      });

      console.log("razorpay order.....", razorpayOrder);


    return {
        status: true,
        appointmentData: {
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        },
    };
      
    } catch (error:any) {
      console.error("Error in getPaymentUsecase:", error);
      return {
        status: false,
        message: error.message || ResponseMessages.PAYMENT_CREATION_FAILED,
      };
    }
  };

  return { executeFunction };
};
