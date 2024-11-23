import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { getTherapistDetailsUsecase } = dependencies.useCase;

    const getAvailableDetailsController = async (req: Request, res: Response ) => {
        try {
            console.log("entered controller.............");
            const { therapistId } = req.query;


            const response = await getTherapistDetailsUsecase(dependencies).executeFunction(therapistId);
         
            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return getAvailableDetailsController;
}