import { Request, Response } from 'express';
import Razorpay from 'razorpay';


export default (dependencies: any) => {
  const { savePaymentUsecase } = dependencies.useCase;

  const verifyPaymentController = async (req: Request, res: Response) => {
    try {
      const { therapistId, userId, slot, notes, totalAmount, paymentStatus, paymentDetails} = req.body; 
      console.log("request body in verify payment controller.......:", req.body);

      // First, execute the use case (this is your existing business logic)
      const paymentData = await savePaymentUsecase(dependencies).executeFunction({
        therapistId,
        userId,
        slot,
        notes,
        totalAmount,
        paymentStatus,
        paymentDetails
      });
      console.log("paymentrdata in verify controller......", paymentData);
      

      if (!paymentData || !paymentData.status) {
        return res.status(400).json({ status: false, message: 'payment creation failed' });
      }


      // Send the order details to the frontend
      res.status(200).json({
        status: true, message: "Successful created payment", paymentId: paymentData.paymentId
       
      });
    } catch (error) {
      console.error('Error in verify payment controller:', error);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  };

  return verifyPaymentController
};
