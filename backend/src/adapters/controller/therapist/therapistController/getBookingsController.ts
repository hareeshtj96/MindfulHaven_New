import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { bookingUsecase } = dependencies.useCase;

    const getBookingsController = async (req: Request, res: Response ) => {

        console.log(" entered get bookings controller.........")
        try {
            const { id } = req.params;
            console.log("id...", id);

            const page = parseInt(req.query.page as string, 10) || 1;
            console.log("page from controller:", page)
            const limit = parseInt(req.query.limit as string, 10) || 2
            console.log("limit from controller:", limit)
           
            const response = await bookingUsecase(dependencies).executeFunction({ therapistId: id, page, limit });

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data, totalPages: response.totalPages});
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in booking controller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return getBookingsController
}