import { Request, Response } from "express";


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
                res.status(200).json({ status: true, data: response.data, totalPages: response.totalPages});
            } else {
                res.status(400).json({ status: false, message: response.message ||"Data not found" })
            }
        } catch (error) {
            console.error("Error in booking controller:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return getBookingsController
}