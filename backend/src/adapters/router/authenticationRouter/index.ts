import express from "express";
import { userController, adminController, therapistController } from "../../controller";
import  roleMiddleware  from "../../../middleware/roleMiddleware";
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
    router.get("/user_profile", userProfileController);
    router.get("/childTherapy", childTherapistController);




    const {
        adminLoginController,
        adminGetTherapist,
        adminGetUsers,
        adminTherapistVerification,
    } = adminController(dependencies);

    router.post('/admin/admin_login', adminLoginController);
    router.get('/admin/admin_getTherapist', adminGetTherapist);
    router.get('/admin/admin_getUsers', adminGetUsers);
    router.patch('/admin/therapist_getVerified/:id', adminTherapistVerification);
    router.use('/admin/*', roleMiddleware(['admin']));



    const {
        therapistRegisterController,
        verifyOTP,
        therapistLogin,
        therapistDetailsController,
        getTherapistProfile,
    } = therapistController(dependencies);


    router.post('/therapist/therapist_register', therapistRegisterController);
    router.post('/therapist/therapist_OTP', verifyOTP);
    router.post('/therapist/therapist_login', therapistLogin);
    router.put('/therapist/therapist_details', upload, therapistDetailsController);
    router.get('/therapist/therapist_profile', getTherapistProfile);
   

    router.use('/therapist/*', roleMiddleware(['therapist']));


    return router;
}