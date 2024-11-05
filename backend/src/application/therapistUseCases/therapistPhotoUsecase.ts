import dependencies from "../../frameworks/config/dependencies";
import { ResponseMessages } from "../../utils/httpStatusCode";
import { uploadFileToS3 } from "../../adapters/router/authenticationRouter/therapistRouter";
import dotenv from 'dotenv';

dotenv.config();

const bucketName = process.env.BUCKET_NAME || ""

export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    const executeFunction = async (therapistId: any, files: { [fieldName: string]: Express.Multer.File[] }) => {
        try {

            if (!files || !files['photo']) {
                return { status: false, message: ResponseMessages.PHOTO_MISSING}
            }

            const newPhoto = files['photo'][0];

            const photoUrl = await uploadFileToS3(newPhoto, bucketName, "therapists/photos")
           
            const response = await therapistRepository.uploadPhoto(therapistId, photoUrl);
            
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_THERAPIST_USECASE };
        }
    }
    return {executeFunction}
}