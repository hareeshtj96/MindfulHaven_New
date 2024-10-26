import Razorpay from 'razorpay';
import { ResponseMessages } from '../../utils/httpStatusCode';
export default (dependencies: any) => {
  const { userRepository } = dependencies.repository;



  const executeFunction = async ({
    therapistId,
    userId,
    slot,
    notes,
    totalAmount,
    paymentStatus,
    paymentDetails,
  }: any) => {
    try {
      // Validate required fields
      if (!therapistId || !userId || !totalAmount || !paymentDetails) {
        throw new Error("Missing required payment details.");
      }

      
      // Fetch therapist fees
      const therapistDetails = await userRepository.getTherapistDetails(therapistId);
   
      if (!therapistDetails || !therapistDetails.data.fees) {
        throw new Error("Unable to retrieve therapist fees.");
      }

      const therapistFees = therapistDetails.data.fees;

      // Prepare payment data for saving
      const paymentData = {
        therapistId,
        userId,
        slot,
        notes,
        totalAmount,
        razorpayOrderId: paymentDetails.paymentDetails.razorpay_order_id,
        amount: therapistFees,
        currency: 'INR',
        status: paymentStatus === 'success' ? 'completed' : 'failed', 
        paymentMethod: 'razorpay',
        paymentStatus,
      };


      // Only save payment details if paymentStatus is success
      if (paymentStatus === 'success') {
        const savePaymentResponse = await userRepository.savePayment(paymentData);

        
        // Check if payment was saved successfully
        if (savePaymentResponse.status) {
          return {
            status: true,
            paymentId: savePaymentResponse.paymentId,
            appointmentData: {
              razorpayOrderId: paymentDetails.paymentDetails.razorpay_order_id,
              amount: totalAmount,
              currency: 'INR',
            },
          };
        } else {
          return { status: false, message: ResponseMessages.FAILED_TO_SAVE_PAYMENT_dATA };
        }
      } else {
        // Return response indicating payment was not successful
        return {
          status: false,
          message: ResponseMessages.PAYMENT_NOT_SUCCESSFUL,
        };
      }
    } catch (error: any) {
      return {
        status: false,
        message: error.message || ResponseMessages.PAYMENT_CREATION_FAILED,
      };
    }
  };

  return { executeFunction };
};
