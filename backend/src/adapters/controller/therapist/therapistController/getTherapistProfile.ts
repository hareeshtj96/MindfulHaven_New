import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { getTherapistProfileUsecase } = dependencies.useCase;

    const getTherapistProfileController = async (req: Request, res: Response ) => {
        try {
            const response = await getTherapistProfileUsecase(dependencies).executeFunction();

            if( response && response.status) {
                console.log("resppinse from controller:", response);
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in  get therapist profile:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return getTherapistProfileController;
}