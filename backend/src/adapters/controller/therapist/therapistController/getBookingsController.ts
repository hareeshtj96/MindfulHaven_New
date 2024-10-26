import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { bookingUsecase } = dependencies.useCase;

    const getBookingsController = async (req: Request, res: Response ) => {
        try {
            const { id } = req.params;
        
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 2
           
            const response = await bookingUsecase(dependencies).executeFunction({ therapistId: id, page, limit });

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data, totalPages: response.totalPages});
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return getBookingsController
}