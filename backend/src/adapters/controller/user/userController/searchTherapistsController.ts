import { Request, Response } from "express";

export default (dependencies:any) => {
    const { searchTherapistUsecase } = dependencies.useCase;

    const searchTherapistController = async (req: Request, res: Response) => {
        console.log("Entered search therapist controller");
        
        try {
            const { search } = req.query;
            console.log("search terem from query params:", search);

            const response = await searchTherapistUsecase(dependencies).executeFunction(search);
            console.log("response from saercch controller:", response);

            if( response && response.status) {
                res.status(200).json({ status: true, data: response.data})
            } else {
                res.status(400).json({ status: false, message: response.message})
            }
            
        } catch (error) {
            console.error("Error in search therapist controller:", error);
            return res.status(500).json({ status: false, message: "Internal Server Error"})
        }
    }
    return searchTherapistController;
}