import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import { log } from "console";

export default (dependencies: any) => {
    const { sortChildTherapistUsecase } = dependencies.useCase;

    const childTherapistSorting = async ( req: Request, res: Response) => {
        try {
            const { sortBy, page, limit } = req.query;

            const pageNumber = parseInt(page as string, 10) || 1;
            const limitNumber = parseInt(limit as string, 10) || 10;
       
            const response = await sortChildTherapistUsecase(dependencies).executeFunction({
                sortBy,
                page: pageNumber,
                limit: limitNumber
            });
         
            if (response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data})
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message})
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR })
        }
    }
    return childTherapistSorting;
}