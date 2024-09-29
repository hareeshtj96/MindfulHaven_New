import { Request, Response } from "express";


export default (dependencies: any) => {
    const { therapistDetailstUsecase } = dependencies.useCase;

    const getTherapistDetailsController = async (req: Request, res: Response ) => {

        console.log(" entered therapist details controller.........")
        try {
            const { id } = req.params;
            console.log("id...", id);
           
            const response = await therapistDetailstUsecase(dependencies).executeFunction({ therapistId: id });
           
            if( response && response.status) {
                
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message ||"Data not found" })
            }
        } catch (error) {
            console.error("Error in therapist details controller:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return getTherapistDetailsController
}