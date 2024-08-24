import express from "express";

import { userController } from "../../controller";

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

    return router;
}