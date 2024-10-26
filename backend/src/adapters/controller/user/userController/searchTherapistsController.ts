import { Request, Response } from "express";
import { HttpStatusCode,ResponseMessages } from "../../../../utils/httpStatusCode";

export default (dependencies:any) => {
    const { searchTherapistUsecase } = dependencies.useCase;

    const searchTherapistController = async (req: Request, res: Response) => {
       
        try {
            const { search } = req.query;
            const response = await searchTherapistUsecase(dependencies).executeFunction(search);
       
            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data})
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message})
            }
            
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR })
        }
    }
    return searchTherapistController;
}