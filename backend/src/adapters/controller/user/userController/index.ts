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
import childTherapistSorting from "./childTherapistSorting";
import paymentManagementController from "./paymentManagementController";
import verifyPaymentController from "./verifyPaymentController";
import joinVideoController from "./joinVideoController";
import searchChildTherapistController from "./searchChildTherapistController";
import cancelAppointment from "./cancelAppointment";
import geminiAPIController from "./geminiAPIController";
import changePasswordController from "./changePasswordController";
import walletDetailsController from "./walletDetailsController";
import submitIssueController from "./submitIssueController";


export default (dependencies:any) => {
    return {
        registrationController: registrationController(dependencies),
        googleAuthController: googleAuthController(dependencies),
        verifyOtpController: verifyOtpController(dependencies),
        resendOTPController: resendOTPController(dependencies),
        loginController: loginController(dependencies),
        forgotPasswordController: forgotPasswordController(dependencies),
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
        childTherapistSorting: childTherapistSorting(dependencies),
        paymentManagementController: paymentManagementController(dependencies),
        verifyPaymentController: verifyPaymentController(dependencies),
        joinVideoController: joinVideoController(dependencies),
        searchChildTherapistController: searchChildTherapistController(dependencies),
        cancelAppointment: cancelAppointment(dependencies),
        geminiAPIController: geminiAPIController(dependencies),
        changePasswordController: changePasswordController(dependencies),
        walletDetailsController: walletDetailsController(dependencies),
        submitIssueController: submitIssueController(dependencies),
        
    }
}