import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

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
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data})
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message})
            }
            
        } catch (error) {
            console.error("Error in submit issue controller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR })
        }
    }
    return submitIssueController;
}