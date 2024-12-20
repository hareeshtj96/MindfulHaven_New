import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { adminDashboardDetailsUsecase } = dependencies.useCase;

    const adminDashboardDetails = async (req: Request, res: Response ) => {

        try {
           
            const response = await adminDashboardDetailsUsecase(dependencies).executeFunction();
           
            if( response && response.status) {
                
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR});
        }
    }
    return adminDashboardDetails;
}