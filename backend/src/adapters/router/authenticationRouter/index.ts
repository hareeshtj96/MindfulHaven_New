import express from "express";
import { userController, adminController, therapistController } from "../../controller";
import  roleMiddleware  from "../../../middleware/roleMiddleware";
import { verifyAccessToken } from "../../../middleware/accessTokenMiddleware";
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

export default (dependencies: any) =>{
    const router = express();
    
    const {
       registrationController,
       verifyOtpController,
       resendOTPController,
       loginController,
       googleAuthController,
       forgotPasswordController,
       resetPassword,
       resetPasswordOtpcontroller,
       refreshTokenController,
       userProfileController,
       childTherapistController,
       slotManagementController,
       appointmentController,
       bookingStatusController,
       sessionsViewController,
       completedBookingController,
       cancelledBookingController,
       appointmentBookedController,
       searchTherapistsController,
       childTherapistSorting,
       paymentManagementController,
       verifyPaymentController,
       joinVideoController,
       searchChildTherapistController,
       cancelAppointment,
       geminiAPIController,
       changePasswordController,
       walletDetailsController,
       submitIssueController,
       familyTherapistController,
       searchFamilyTherapistController,
       familyTherapistSorting,
       individualTherapistController,
       individualTherapistSorting,
       searchIndividualTherapistController,
       coupleTherapistController,
       coupleTherapistSorting
    } = userController(dependencies);


    router.post('/register', registrationController);
    router.post('/register_google_auth', googleAuthController);
    router.post('/verify_otp', verifyOtpController);
    router.post('/resend_OTP', resendOTPController);
    router.post('/login', loginController);
    router.post('/forgot_password', forgotPasswordController);
    router.post('/forgot_password_otp',resetPasswordOtpcontroller);
    router.post('/password_reset', resetPassword);
    router.post('/refresh_token', refreshTokenController);
    router.get("/user_profile", verifyAccessToken,userProfileController);
    router.get("/childTherapy", childTherapistController);
    router.get('/slot_management/:id', slotManagementController);
    router.get('/booked_slots/:id', appointmentBookedController);
    router.post('/create_appointment', appointmentController);
    router.get('/booking_status/:id', bookingStatusController);
    router.get('/booking_details', verifyAccessToken, sessionsViewController);
    router.get('/booking_Completeddetails', verifyAccessToken, completedBookingController);
    router.get('/booking_Cancelleddetails', verifyAccessToken, cancelledBookingController);
    router.get('/search_therapist', searchTherapistsController);
    router.get('/search_childTherapist', searchChildTherapistController);
    router.get('/sort_therapists', childTherapistSorting);
    router.post('/payment', paymentManagementController);
    router.post('/verify_payment', verifyPaymentController);
    router.post('/join_session', joinVideoController);
    router.patch('/cancel_appointment', cancelAppointment);
    router.post('/search', geminiAPIController);
    router.put('/changePassword', changePasswordController);
    router.get('/walletDetails', walletDetailsController);
    router.post('/submitIssue', submitIssueController);
    router.get('/familyTherapy', familyTherapistController);
    router.get('/search_familyTherapist', searchFamilyTherapistController);
    router.get('/sort_familyTherapist', familyTherapistSorting);
    router.get('/individualTherapy', individualTherapistController);
    router.get('/sort_individualTherapist', individualTherapistSorting);
    router.get('/search_individualTherapist', searchIndividualTherapistController);
    router.get('/coupleTherapy', coupleTherapistController);
    router.get('/sort_coupleTherapist', coupleTherapistSorting);


    return router;
}