import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { walletDetailsUsecase } = dependencies.useCase;

    const walletDetailsController = async (req: Request, res: Response ) => {
        try {
            const { userId } = req.query
            
            const response = await walletDetailsUsecase(dependencies).executeFunction({ userId});

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.OK).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({status: false, message: ResponseMessages.TOKEN_EXPIRED });
        }
    }
    return  walletDetailsController;
}