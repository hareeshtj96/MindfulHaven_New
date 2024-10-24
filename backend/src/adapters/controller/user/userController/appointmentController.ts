import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { getAppointmentUsecase } = dependencies.useCase;

    const appointmentController = async (req: Request, res: Response ) => {

        console.log(" entered appointment controller.........")
        try {
            const { therapistId, userId, slot, notes, paymentId } = req.body;
            console.log(" re body appointemnt ocontroller....", req.body);
            
            const response = await getAppointmentUsecase(dependencies).executeFunction({ therapistId,
                userId,
                slot,
                notes,
            paymentId });

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in  appointment controller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return appointmentController;
}