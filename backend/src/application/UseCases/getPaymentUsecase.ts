
import Razorpay from 'razorpay';

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

    //   // Fetch therapist fees 
    //   const therapistDetails = await userRepository.getTherapistDetails(therapistId);
    //   console.log("therapist details....", therapistDetails);
      

    //   if (!therapistDetails || !therapistDetails.data.fees) {
    //     throw new Error("unable to retrieve therapist fees");
    //   }

    //   const therapistFees = therapistDetails.data.fees;


      // Create an order with Razorpay
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, 
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: true,
      });

      console.log("razorpay order.....", razorpayOrder);

    //   // save payment details to databse using userRepository
    //   const paymentData = {
    //      therapistId,
    //      userId, 
    //      slot, 
    //      notes, 
    //      totalAmount, 
    //      razorpayOrderId: razorpayOrder.id,
    //      amount: therapistFees,
    //      currency: razorpayOrder.currency,
    //      status: 'created',
    //      paymentMethod: 'razorpay',
    //      paymentStatus: paymentStatus
    //   }

    //   console.log("payment data from use case..............", paymentData);
      
      
    //   const savePaymentResponse = await userRepository.savePayment(paymentData);

    //   // Return order details
    //   if (savePaymentResponse.status) {
    //     return {
    //         status: true,
    //         appointmentData: {
    //           razorpayOrderId: razorpayOrder.id,
    //           amount: razorpayOrder.amount,
    //           currency: razorpayOrder.currency,
    //         },
    //       };

    //   } else {
    //     return { status: false, message: 'Failed to save payment data'}
    //   }


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
        message: error.message || "Payment creation failed.",
      };
    }
  };

  return { executeFunction };
};
