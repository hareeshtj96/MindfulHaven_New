import { Request, Response} from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import dotenv from 'dotenv'

dotenv.config();


interface RequestWithUser extends Request {
    user?: {
      therapistId: string;
    };
}


export default (dependencies: any) => {
    const { therapistPhotoUsecase } = dependencies.useCase;

    const updatePhotoController = async (req: RequestWithUser, res: Response) => {
        try {
            
            const therapistId = req.user?.therapistId;
          
            if (!therapistId) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.THERAPIST_ID_REQUIRED})
            }

            const updateResult = await therapistPhotoUsecase(dependencies).executeFunction(therapistId, req.files);
           
            if (!updateResult) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: ResponseMessages.FAILED_TO_UPDATE_THERAPIST_PHOTO });
            }

            res.status(HttpStatusCode.OK).json({ status: true, message: ResponseMessages.PHOTO_UPDATED, data: updateResult });
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR})
        }
    }
    return updatePhotoController;
}