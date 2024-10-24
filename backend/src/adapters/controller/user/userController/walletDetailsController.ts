import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { walletDetailsUsecase } = dependencies.useCase;

    const walletDetailsController = async (req: Request, res: Response ) => {

        console.log(" entered wallet details controller.........")
        try {
            const { userId } = req.query
            console.log("req query....", req.query);
           
            const response = await walletDetailsUsecase(dependencies).executeFunction({ userId});

            if( response && response.status) {
                console.log("response from wallet details controller:", response);
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in wallet details controller:", error);
            return res.status(HttpStatusCode.UNAUTHORIZED).json({status: false, message: ResponseMessages.TOKEN_EXPIRED });
        }
    }
    return  walletDetailsController;
}