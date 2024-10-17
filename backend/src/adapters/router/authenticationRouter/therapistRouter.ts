import express from "express";
import {  therapistController } from "../../controller";
import  roleMiddleware  from "../../../middleware/roleMiddleware";
import dependencies from "../../../frameworks/config/dependencies";
import multer from 'multer';


const storage = multer.diskStorage({
    destination: (req,file,cb)=> {
      cb(null, "src/public/uploads/")
    },
    filename:  (req, file, cb)=> {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

const upload = multer({ storage: storage}).fields([
    {name: 'photo', maxCount:1},
    {name: 'identityProof', maxCount: 1}
]);


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
        cancelAppointmentTherapist
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
   

    router.use('/*', roleMiddleware(['therapist']));

    return router;

}