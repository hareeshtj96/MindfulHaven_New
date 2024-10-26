import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { bookingDetailstUsecase } = dependencies.useCase;

    const bookingStatusController = async (req: Request, res: Response ) => {
        try {
            const { id } = req.params;
            
            const response = await bookingDetailstUsecase(dependencies).executeFunction({ bookingId: id });

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({status: false, message: ResponseMessages.TOKEN_EXPIRED });
        }
    }
    return bookingStatusController;
}