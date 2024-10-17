import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { log } from "console";

export default (dependencies: any) => {
    const { sortChildTherapistUsecase } = dependencies.useCase;

    const childTherapistSorting = async ( req: Request, res: Response) => {
        console.log("Entered child therpsit sorting controller");
        
        try {
            const { sortBy } = req.query;
            console.log("sort by parameter from query params:", sortBy);

            const response = await sortChildTherapistUsecase(dependencies).executeFunction(sortBy);
         

            if (response && response.status) {
                res.status(200).json({ status: true, data: response.data})
            } else {
                res.status(400).json({ status: false, message: response.message})
            }
            
            
        } catch (error) {
            console.error("Error in child therapist sorting controller:", error);
            return res.status(500).json({ status: false, message: "Internal Server Error"})
        }
    }
    return childTherapistSorting;
}