import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { fetchTherapistUsecase } = dependencies.useCase;

    const fetchProfitTherapist = async (req: Request, res: Response ) => {
        try {
            const {  therapistId } = req.query;
            console.log("therapost id in contrller:", therapistId);

            const response = await fetchTherapistUsecase(dependencies).executeFunction(therapistId);
            console.log("response from controller:", response);
            
            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({
                    status: true,
                    totalProfit: response.totalProfit,
                    mostBookedHour: response.mostBookedHour,
                    userName: response.userName,
                });
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in contoller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return fetchProfitTherapist;
}