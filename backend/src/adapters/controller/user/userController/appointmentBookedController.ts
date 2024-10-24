import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { getBookedSlotsUsecase } = dependencies.useCase;

    const appointmentBookedController = async (req: Request, res: Response ) => {

        console.log(" entered appointment booked controller.........")
        try {
            const { id } = req.params;
            console.log("id from params:", id);

            const response = await getBookedSlotsUsecase(dependencies).executeFunction(id);
            console.log("response from controller:", response);

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message  })
            }
        } catch (error) {
            console.error("Error in  appointment booked controller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return appointmentBookedController;
}