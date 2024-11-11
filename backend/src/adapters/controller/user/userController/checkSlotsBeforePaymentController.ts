import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { checkSlotBeforePaymentUsecase } = dependencies.useCase;

    const checkSlotBeforePaymentController = async (req: Request, res: Response ) => {
        try {
            const { id } = req.params;

            const slotDate = req.query.slotDate as string;
            const slotTime = req.query.slotTime as string;
  
            const response = await checkSlotBeforePaymentUsecase(dependencies).executeFunction(id, slotDate, slotTime);
            
            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, message: response.message });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message  })
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return checkSlotBeforePaymentController;
}