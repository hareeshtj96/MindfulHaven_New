import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { getChildTherapistUsecase } = dependencies.useCase;

    const childTherapistController = async (req: Request, res: Response) => {
        console.log("Entered child therapist controller");
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            console.log("page,limit:", page, limit);
            const response = await getChildTherapistUsecase(dependencies).executeFunction({page, limit})
            console.log("response from controller:", response);

            if(response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.CHILD_THERAPIST_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in child therapist controller:",error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR })
        }
    }
    return childTherapistController;
}