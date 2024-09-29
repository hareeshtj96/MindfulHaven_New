import registrationController from "./registrationController";
import verifyOtpController from "./verifyOtpController";
import loginController from "./loginController";
import googleAuthController from "./googleAuthController";
import forgotPasswordController from "./forgotPasswordController";
import resetPassword from "./passwordResetController";
import resetPasswordOtpcontroller from "./passwordOtpController";
import { refreshTokenController } from "./refreshTokenController";
import resendOTPController from "./resendOTPController";
import userProfileController from "./userProfileController";
import childTherapistController from "./childTherapistController";
import slotManagementController from "./slotManagementController";
import appointmentController from "./appointmentController";
import bookingStatusController from "./bookingStatusController";
import sessionsViewController from "./sessionsViewController";
import completedBookingController from "./completedBookingController";
import cancelledBookingController from "./cancelledBookingController";
import appointmentBookedController from "./appointmentBookedController";
import searchTherapistsController from "./searchTherapistsController";



export default (dependencies:any) => {
    return {
        registrationController:registrationController(dependencies),
        googleAuthController:googleAuthController(dependencies),
        verifyOtpController:verifyOtpController(dependencies),
        resendOTPController: resendOTPController(dependencies),
        loginController:loginController(dependencies),
        forgotPasswordController:forgotPasswordController(dependencies),
        resetPassword: resetPassword(dependencies),
        resetPasswordOtpcontroller: resetPasswordOtpcontroller(dependencies),
        refreshTokenController: refreshTokenController(dependencies),
        userProfileController: userProfileController(dependencies),
        childTherapistController: childTherapistController(dependencies),
        slotManagementController: slotManagementController(dependencies),
        appointmentController: appointmentController(dependencies),
        bookingStatusController: bookingStatusController(dependencies),
        sessionsViewController: sessionsViewController(dependencies),
        completedBookingController: completedBookingController(dependencies),
        cancelledBookingController: cancelledBookingController(dependencies),
        appointmentBookedController: appointmentBookedController(dependencies),
        searchTherapistsController: searchTherapistsController(dependencies),
        
    }
}