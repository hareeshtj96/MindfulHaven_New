import { Request, Response } from 'express';
import { HttpStatusCode, ResponseMessages } from '../../../../utils/httpStatusCode';

export default (dependencies: any) => {
  const { walletPaymentUsecase } = dependencies.useCase;

  const walletPaymentController = async (req: Request, res: Response) => {
    try {
      const { therapistId, userId, slot, notes, totalAmount } = req.body;

      // Execute the wallet payment use case
      const paymentData = await walletPaymentUsecase(dependencies).executeFunction({
        therapistId,
        userId,
        slot,
        notes,
        totalAmount,
      });


      if (!paymentData || !paymentData.status) {
        return res
          .status(HttpStatusCode.OK)
          .json({ status: false, message: paymentData.message });
      }

      // Send the payment confirmation details to the frontend
      res.status(HttpStatusCode.OK).json({
        status: true,
        message: paymentData.message,
        data: paymentData.data
      });
    } catch (error) {
      console.error('Error in walletPaymentController:', error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
    }
  };

  return walletPaymentController;
};
