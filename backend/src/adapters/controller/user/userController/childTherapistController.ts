import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";

export default (dependencies: any) => {
    const { getChildTherapistUsecase } = dependencies.useCase;

    const childTherapistController = async (req: Request, res: Response) => {
        console.log("Entered child therapist controller");
        try {
            const response = await getChildTherapistUsecase(dependencies).executeFunction()
          

            if(response && response.status) {
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(404).json({ status: false, message: "Child therapist not found"})
            }
        } catch (error) {
            console.error("Error in child therapist controller:",error);
            return res.status(500).json({ status: false, message: "Internal Server Error"})
        }
    }
    return childTherapistController;
}