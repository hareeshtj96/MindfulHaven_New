import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { cancelAppointmentTherapistUsecase } = dependencies.useCase;

    const cancelAppointmentTherapistController = async (req: Request, res: Response ) => {

        console.log(" entered cancel appointment therapist controller.........")
        try {
            const { bookingId} = req.body
            console.log("req body....", req.body);
           
            const response = await cancelAppointmentTherapistUsecase(dependencies).executeFunction({ bookingId });

            if( response && response.status) {
                console.log("response from cancel appointment controller:", response);
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in cancel appointment controller:", error);
            return res.status(HttpStatusCode.UNAUTHORIZED).json({status: false, message: ResponseMessages.TOKEN_EXPIRED });
        }
    }
    return cancelAppointmentTherapistController;
}