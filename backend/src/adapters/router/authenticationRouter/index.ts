import express from "express";
import { userController, adminController, therapistController } from "../../controller";
import  roleMiddleware  from "../../../middleware/roleMiddleware";
import multer from 'multer';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
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
       loginController,
       googleAuthController,
       forgotPasswordController,
       resetPassword,
       resetPasswordOtpcontroller,
       refreshTokenController,
    } = userController(dependencies);


    router.post('/register', registrationController);
    router.post('/register_google_auth', googleAuthController);
    router.post('/verify_otp', verifyOtpController);
    router.post('/login', loginController);
    router.post('/forgot_password', forgotPasswordController);
    router.post('/forgot_password_otp',resetPasswordOtpcontroller);
    router.post('/password_reset', resetPassword);
    router.post('/refresh_token', refreshTokenController);




    const {
        adminLoginController,
    } = adminController(dependencies);

    router.post('/admin/admin_login', adminLoginController);
    router.use('/admin/*', roleMiddleware(['admin']));



    const {
        therapistRegisterController,
        verifyOTP,
        therapistLogin,
        therapistDetailsController,
    } = therapistController(dependencies);


    router.post('/therapist/therapist_register', therapistRegisterController);
    router.post('/therapist/therapist_OTP', verifyOTP);
    router.post('/therapist/therapist_login', therapistLogin);
    router.put('/therapist/therapist_details', upload, therapistDetailsController);

    router.use('/therapist/*', roleMiddleware(['therapist']));


    return router;
}