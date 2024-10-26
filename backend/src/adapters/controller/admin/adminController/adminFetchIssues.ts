import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { getIssuesUsecase } = dependencies.useCase;

    const adminFetchIssues = async (req:Request, res: Response) => {
        try {
           
            const response = await getIssuesUsecase(dependencies).executeFunction();

            if(response && response.status) {
                return res.status(HttpStatusCode.OK).json({ status: true, data: response.data});
            } else {
                return res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.DATA_NOT_FOUND})
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR});
        }
    }
    return adminFetchIssues;
}