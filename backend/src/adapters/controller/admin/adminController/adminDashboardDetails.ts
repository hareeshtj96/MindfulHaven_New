import { Request, Response } from "express";


export default (dependencies: any) => {
    const { adminDashboardDetailsUsecase } = dependencies.useCase;

    const adminDashboardDetails = async (req: Request, res: Response ) => {

        console.log(" entered admin dashboard details controller.........")
        try {
           
            const response = await adminDashboardDetailsUsecase(dependencies).executeFunction();
           
            if( response && response.status) {
                
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message ||"Data not found" })
            }
        } catch (error) {
            console.error("Error in admin dashboard details controller:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return adminDashboardDetails;
}