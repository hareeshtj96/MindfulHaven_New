import { Request, Response } from "express";


export default (dependencies: any) => {
    const { cancelAppointmentUsecase } = dependencies.useCase;

    const cancelAppointmentController = async (req: Request, res: Response ) => {

        console.log(" entered cancel appointment controller.........")
        try {
            const { bookingId, userId } = req.body
            console.log("req body....", req.body);
           
            const response = await cancelAppointmentUsecase(dependencies).executeFunction({ bookingId, userId});

            if( response && response.status) {
                console.log("response from cancel appointment controller:", response);
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message ||"Data not found" })
            }
        } catch (error) {
            console.error("Error in cancel appointment controller:", error);
            return res.status(401).json({status: false, message: "Token expired"});
        }
    }
    return cancelAppointmentController;
}