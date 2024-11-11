import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { cancelSlotUsecase } = dependencies.useCase;

    const cancelSlotController = async (req: Request, res: Response ) => {
        try {
            const { slot, therapistId } = req.body;

            const response = await cancelSlotUsecase(dependencies).executeFunction({slot, therapistId});
            
            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in contoller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return cancelSlotController;
}