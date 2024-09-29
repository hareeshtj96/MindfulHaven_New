import { Request, Response } from "express";


export default (dependencies: any) => {
    const { getAppointmentUsecase } = dependencies.useCase;

    const appointmentController = async (req: Request, res: Response ) => {

        console.log(" entered appointment controller.........")
        try {
            const { therapistId, userId, slot, notes } = req.body;
            
           
            const response = await getAppointmentUsecase(dependencies).executeFunction({ therapistId,
                userId,
                slot,
                notes, });

            if( response && response.status) {
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message ||"Data not found" })
            }
        } catch (error) {
            console.error("Error in  appointment controller:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return appointmentController;
}