import { Request, Response } from "express";

export default (dependencies:any) => {
    const { searchChildTherapistUsecase } = dependencies.useCase;

    const searchChildTherapistController = async (req: Request, res: Response) => {
        console.log("Entered search child therapist controller");
        
        try {
            const { search } = req.query;
            console.log("search term from query params:", search);

            const response = await searchChildTherapistUsecase(dependencies).executeFunction(search);
            console.log("response from saercch child therapistcontroller:", response);

            if( response && response.status) {
                res.status(200).json({ status: true, data: response.data})
            } else {
                res.status(400).json({ status: false, message: response.message})
            }
            
        } catch (error) {
            console.error("Error in search child therapist controller:", error);
            return res.status(500).json({ status: false, message: "Internal Server Error"})
        }
    }
    return searchChildTherapistController;
}