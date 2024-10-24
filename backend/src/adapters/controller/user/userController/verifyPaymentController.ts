import { Request, Response } from 'express';
import { HttpStatusCode, ResponseMessages } from '../../../../utils/httpStatusCode';
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
        return res.status(400).json({ status: false, message: ResponseMessages.PAYMENT_CREATION_FAILED });
      }


      // Send the order details to the frontend
      res.status(HttpStatusCode.OK).json({
        status: true, message: ResponseMessages.SUCCESSFULLY_CREATED_PAYMENT, paymentId: paymentData.paymentId
       
      });
    } catch (error) {
      console.error('Error in verify payment controller:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  return verifyPaymentController
};
