import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { adminNotificationsUsecase } = dependencies.useCase;

    const adminNotificationsController = async (req: Request, res: Response ) => {
        try {
            console.log("entered notification controller.......")
            const response = await adminNotificationsUsecase(dependencies).executeFunction();
            console.log("response from contoller:", response);

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.OK).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({status: false, message: ResponseMessages.TOKEN_EXPIRED });
        }
    }
    return  adminNotificationsController;
}