import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { getBookedSlotsUsecase } = dependencies.useCase;

    const appointmentBookedController = async (req: Request, res: Response ) => {
        try {
            const { id } = req.params;
            
            const response = await getBookedSlotsUsecase(dependencies).executeFunction(id);
            
            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message  })
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return appointmentBookedController;
}