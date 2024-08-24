import registrationController from "./registrationController";
import verifyOtpController from "./verifyOtpController";
import loginController from "./loginController";
import googleAuthController from "./googleAuthController";
import forgotPasswordController from "./forgotPasswordController";

export default (dependencies:any) => {
    return {
        registrationController:registrationController(dependencies),
        googleAuthController:googleAuthController(dependencies),
        verifyOtpController:verifyOtpController(dependencies),
        loginController:loginController(dependencies),
        forgotPasswordController:forgotPasswordController(dependencies),
    }
}