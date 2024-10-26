import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { getIssuesresolvedUsecase } = dependencies.useCase;

    const adminIssueResolveController = async (req:Request, res: Response) => {
        try {
           
            const { issueId } = req.body;
            const response = await getIssuesresolvedUsecase(dependencies).executeFunction(issueId);

            if(response && response.status) {
                return res.status(HttpStatusCode.OK).json({ status: true, message: response.message});
            } else {
                return res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: response.message})
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return adminIssueResolveController;
}