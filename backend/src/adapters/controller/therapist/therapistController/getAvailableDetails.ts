import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { getTherapistDetailsUsecase } = dependencies.useCase;

    const getAvailableDetailsController = async (req: Request, res: Response ) => {
        console.log(" entered avaialble dates controller..")
        try {
            const { therapistId } = req.query;

            console.log("therapist id from req body:", therapistId);

            const response = await getTherapistDetailsUsecase(dependencies).executeFunction(therapistId);
            console.log("response from get details controller:", response);

            if( response && response.status) {
                console.log("response from controller:", response);
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in  get therapist details:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return getAvailableDetailsController;
}