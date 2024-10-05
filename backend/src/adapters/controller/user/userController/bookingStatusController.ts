import { Request, Response } from "express";


export default (dependencies: any) => {
    const { bookingDetailstUsecase } = dependencies.useCase;

    const bookingStatusController = async (req: Request, res: Response ) => {

        console.log(" entered boking status controller.........")
        try {
            const { id } = req.params;
            console.log("id...", id);
           
            const response = await bookingDetailstUsecase(dependencies).executeFunction({ bookingId: id });

            if( response && response.status) {
                console.log("response from controller:", response);
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message ||"Data not found" })
            }
        } catch (error) {
            console.error("Error in booking status controller:", error);
            return res.status(401).json({status: false, message: "Token expired"});
        }
    }
    return bookingStatusController;
}