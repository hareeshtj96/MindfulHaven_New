import { Request, Response } from "express";

export default (dependencies:any) => {
    const { submitIssueUsecase } = dependencies.useCase;

    const submitIssueController = async (req: Request, res: Response) => {
        console.log("Entered submit issue controller");
        
        try {
            const  details  = req.body;
            console.log("details:", details);

            const response = await submitIssueUsecase(dependencies).executeFunction(details);
            console.log("response from submit issue controller:", response);

            if( response && response.status) {
                res.status(200).json({ status: true, data: response.data})
            } else {
                res.status(400).json({ status: false, message: response.message})
            }
            
        } catch (error) {
            console.error("Error in submit issue controller:", error);
            return res.status(500).json({ status: false, message: "Internal Server Error"})
        }
    }
    return submitIssueController;
}