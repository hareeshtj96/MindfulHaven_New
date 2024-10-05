import { Request, Response } from 'express';
import Razorpay from 'razorpay';


export default (dependencies: any) => {
  const { getPaymentUsecase } = dependencies.useCase;

  const paymentManagementController = async (req: Request, res: Response) => {
    try {
      const { therapistId, userId, slot, notes, totalAmount} = req.body; 
      console.log("request body:", req.body);

      // First, execute the use case (this is your existing business logic)
      const paymentData = await getPaymentUsecase(dependencies).executeFunction({
        therapistId,
        userId,
        slot,
        notes,
        totalAmount,
      });
      console.log("paymentrdata......", paymentData);
      

      if (!paymentData || !paymentData.status) {
        return res.status(400).json({ status: false, message: 'payment creation failed' });
      }


      // Send the order details to the frontend
      res.status(200).json({
        status: true,
        razorpayOrderId: paymentData.appointmentData.razorpayOrderId,
        amount: paymentData.appointmentData.amount,
        currency: paymentData.appointmentData.currency
      });
    } catch (error) {
      console.error('Error in payment management controller:', error);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  };

  return paymentManagementController;
};
