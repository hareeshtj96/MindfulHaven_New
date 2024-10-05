import Razorpay from 'razorpay';

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

      console.log("Therapist ID:", therapistId);
      console.log("Payment status from use case:", paymentStatus);

      // Fetch therapist fees
      const therapistDetails = await userRepository.getTherapistDetails(therapistId);
      console.log("Therapist details:", therapistDetails);

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

      console.log("Payment data to be saved:", paymentData);

      // Only save payment details if paymentStatus is success
      if (paymentStatus === 'success') {
        const savePaymentResponse = await userRepository.savePayment(paymentData);

        console.log("save response.......", savePaymentResponse);

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
          return { status: false, message: 'Failed to save payment data.' };
        }
      } else {
        // Return response indicating payment was not successful
        return {
          status: false,
          message: 'Payment was not successful; no data saved.',
        };
      }
    } catch (error: any) {
      console.error("Error in savePaymentUsecase:", error);
      return {
        status: false,
        message: error.message || "Payment creation failed.",
      };
    }
  };

  return { executeFunction };
};
