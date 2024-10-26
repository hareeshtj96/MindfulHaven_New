import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { getAllUsecase } = dependencies.useCase;

    const adminTherapistController = async (req:Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
           
            const limit = parseInt(req.query.limit as string, 10) || 2
           
            const response = await getAllUsecase(dependencies).executeFunction({page, limit});

            if(response && response.status) {
                return res.status(HttpStatusCode.OK).json({ status: true, data: response.data});
            } else {
                return res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.DATA_NOT_FOUND})
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR});
        }
    }
    return adminTherapistController;
}