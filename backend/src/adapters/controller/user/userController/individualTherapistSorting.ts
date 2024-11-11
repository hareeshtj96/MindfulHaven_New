import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { sortIndividualTherapistUsecase } = dependencies.useCase;

    const individualTherapistSorting = async ( req: Request, res: Response) => {
        try {
            const { sortBy } = req.query;
           
            const response = await sortIndividualTherapistUsecase(dependencies).executeFunction(sortBy);
          
            if (response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data})
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message})
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR })
        }
    }
    return individualTherapistSorting;
}