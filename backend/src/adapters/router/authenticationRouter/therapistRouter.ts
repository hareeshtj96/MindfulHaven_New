import express from "express";
import {  therapistController } from "../../controller";
import  roleMiddleware  from "../../../middleware/roleMiddleware";
import { therapistTokenAuthenticate } from "../../../middleware/therapistTokenAuthentication";
import dependencies from "../../../frameworks/config/dependencies";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import multer from 'multer';

import dotenv from 'dotenv';
import { log } from "console";


dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const bucketAcessKey = process.env.BUCKET_ACCESS_KEY_ID
const bucketSecret= process.env.BUCKET_ACCESS_SECRET_KEY 

const s3 = new S3Client({
  credentials: {
    accessKeyId: bucketAcessKey ?? "",
    secretAccessKey: bucketSecret ?? "",
  },
  region: bucketRegion
});

const storage = multer.memoryStorage()

const upload = multer({ storage: storage}).fields([
    {name: 'photo', maxCount:1},
    {name: 'identityProof', maxCount: 1}
]);


export async function uploadFileToS3(file: Express.Multer.File, bucketName: string, folder = "") {
 
  const fileName = `${Date.now()}-${file.originalname}`;
  const params: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: `${folder}/${fileName}`,  
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));
   
    return `https://${bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${folder}/${fileName}`;
  } catch (error) {
    console.error("Error in upload file to s3:", error)
    throw error;
  }
}


export default (dependencies: any) => {
    const router = express();

    const {
        therapistRegisterController,
        verifyOTP,
        therapistLogin,
        therapistDetailsController,
        getTherapistProfile,
        getBookingsController,
        therapistUpdateTimingsController,
        therapistVideoController,
        cancelAppointmentTherapist,
        getAvailableDetails,
        cancelSlotController,
        updatePhotoController
    } = therapistController(dependencies);


    router.post('/therapist_register', therapistRegisterController);
    router.post('/therapist_OTP', verifyOTP);
    router.post('/therapist_login', therapistLogin);
    router.put('/therapist_details', upload, therapistDetailsController);
    router.get('/therapist_profile', getTherapistProfile);
    router.get('/therapist_bookings/:id', getBookingsController);
    router.put('/therapist_updateTimings', therapistUpdateTimingsController);
    router.post('/therapist_video_call', therapistVideoController)
    router.patch('/therapist_cancelAppointment', cancelAppointmentTherapist);
    router.get('/therapist_availableDetails', getAvailableDetails);
    router.put('/therapist_cancelSlot', cancelSlotController);
    router.put('/updatePhoto',upload, therapistTokenAuthenticate, updatePhotoController)
   

    router.use('/*', roleMiddleware(['therapist']));

    return router;

}