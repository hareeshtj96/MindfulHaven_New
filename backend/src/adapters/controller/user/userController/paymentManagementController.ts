import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import { HttpStatusCode, ResponseMessages } from '../../../../utils/httpStatusCode';


export default (dependencies: any) => {
  const { getPaymentUsecase } = dependencies.useCase;

  const paymentManagementController = async (req: Request, res: Response) => {
    try {
      const { therapistId, userId, slot, notes, totalAmount} = req.body; 
    
      // First, execute the use case (this is your existing business logic)
      const paymentData = await getPaymentUsecase(dependencies).executeFunction({
        therapistId,
        userId,
        slot,
        notes,
        totalAmount,
      });

      
      if (!paymentData || !paymentData.status) {
        return res.status(HttpStatusCode.OK).json({ status: false, message: ResponseMessages.PAYMENT_CREATION_FAILED });
      }

      

      // Send the order details to the frontend
      res.status(HttpStatusCode.OK).json({
        status: true,
        razorpayOrderId: paymentData.appointmentData.razorpayOrderId,
        amount: paymentData.appointmentData.amount,
        currency: paymentData.appointmentData.currency,

        reserveAppointment: paymentData.reserveAppointment,
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  return paymentManagementController;
};
