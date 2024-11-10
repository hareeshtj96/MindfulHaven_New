import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { sortCoupleTherapistUsecase } = dependencies.useCase;

    const coupleTherapistSorting = async ( req: Request, res: Response) => {
        try {
            console.log("entered controller");
            
            const { sortBy } = req.query;
           
            const response = await sortCoupleTherapistUsecase(dependencies).executeFunction(sortBy);
            console.log("responser from sorting controller:", response);
            
         
            if (response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data})
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message})
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR })
        }
    }
    return coupleTherapistSorting;
}