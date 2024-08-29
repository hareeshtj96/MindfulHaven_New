import express from "express";

import { userController, adminController, therapistController } from "../../controller";


export default (dependencies: any) =>{
    const router = express();
    
    const {
       registrationController,
       verifyOtpController,
       loginController,
       googleAuthController,
       forgotPasswordController,
    } = userController(dependencies);


    router.post('/register', registrationController);
    router.post('/register_google_auth', googleAuthController);
    router.post('/verify_otp', verifyOtpController);
    router.post('/login', loginController);
    router.post('/forgot_password', forgotPasswordController);




    const {
        adminLoginController,
    } = adminController(dependencies);

    router.post('/admin/admin_login', adminLoginController);



    const {
        therapistRegisterController,
        verifyOTP,
        therapistLogin,
    } = therapistController(dependencies);


    router.post('/therapist/therapist_register', therapistRegisterController);
    router.post('/therapist/therapist_OTP', verifyOTP);
    router.post('/therapist/therapist_login', therapistLogin);


    return router;
}