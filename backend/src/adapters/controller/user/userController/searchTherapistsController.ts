import { Request, Response } from "express";
import { HttpStatusCode,ResponseMessages } from "../../../../utils/httpStatusCode";

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
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data})
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message})
            }
            
        } catch (error) {
            console.error("Error in search therapist controller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR })
        }
    }
    return searchTherapistController;
}