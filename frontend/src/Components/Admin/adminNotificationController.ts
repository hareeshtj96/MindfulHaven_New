import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { therapistNotificationsUsecase } = dependencies.useCase;

    const therapistNotificationsController = async (req: Request, res: Response ) => {
        try {
            const { therapistId } = req.query
            
            const response = await therapistNotificationsUsecase(dependencies).executeFunction({ therapistId});

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.OK).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({status: false, message: ResponseMessages.TOKEN_EXPIRED });
        }
    }
    return  therapistNotificationsController;
}