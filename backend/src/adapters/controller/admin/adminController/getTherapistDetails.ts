import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { therapistDetailstUsecase } = dependencies.useCase;

    const getTherapistDetailsController = async (req: Request, res: Response ) => {

        console.log(" entered therapist details controller.........")
        try {
            const { id } = req.params;
            console.log("id...", id);
           
            const response = await therapistDetailstUsecase(dependencies).executeFunction({ therapistId: id });
           
            if( response && response.status) {
                
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in therapist details controller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return getTherapistDetailsController
}