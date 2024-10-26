import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { cancelAppointmentUsecase } = dependencies.useCase;

    const cancelAppointmentController = async (req: Request, res: Response ) => {
        try {
            const { bookingId, userId } = req.body
            
            const response = await cancelAppointmentUsecase(dependencies).executeFunction({ bookingId, userId});

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND})
            }
        } catch (error) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return cancelAppointmentController;
}