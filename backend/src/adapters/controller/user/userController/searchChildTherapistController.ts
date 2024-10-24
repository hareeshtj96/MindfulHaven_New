import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

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
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data})
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message})
            }
            
        } catch (error) {
            console.error("Error in search child therapist controller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR })
        }
    }
    return searchChildTherapistController;
}