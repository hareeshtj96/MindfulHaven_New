"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registrationController_1 = __importDefault(require("./registrationController"));
const verifyOtpController_1 = __importDefault(require("./verifyOtpController"));
const loginController_1 = __importDefault(require("./loginController"));
const googleAuthController_1 = __importDefault(require("./googleAuthController"));
const forgotPasswordController_1 = __importDefault(require("./forgotPasswordController"));
const passwordResetController_1 = __importDefault(require("./passwordResetController"));
const passwordOtpController_1 = __importDefault(require("./passwordOtpController"));
const refreshTokenController_1 = require("./refreshTokenController");
const resendOTPController_1 = __importDefault(require("./resendOTPController"));
const userProfileController_1 = __importDefault(require("./userProfileController"));
const childTherapistController_1 = __importDefault(require("./childTherapistController"));
const slotManagementController_1 = __importDefault(require("./slotManagementController"));
const appointmentController_1 = __importDefault(require("./appointmentController"));
const bookingStatusController_1 = __importDefault(require("./bookingStatusController"));
const sessionsViewController_1 = __importDefault(require("./sessionsViewController"));
const completedBookingController_1 = __importDefault(require("./completedBookingController"));
const cancelledBookingController_1 = __importDefault(require("./cancelledBookingController"));
const appointmentBookedController_1 = __importDefault(require("./appointmentBookedController"));
const searchTherapistsController_1 = __importDefault(require("./searchTherapistsController"));
const childTherapistSorting_1 = __importDefault(require("./childTherapistSorting"));
const paymentManagementController_1 = __importDefault(require("./paymentManagementController"));
const verifyPaymentController_1 = __importDefault(require("./verifyPaymentController"));
const joinVideoController_1 = __importDefault(require("./joinVideoController"));
const searchChildTherapistController_1 = __importDefault(require("./searchChildTherapistController"));
const cancelAppointment_1 = __importDefault(require("./cancelAppointment"));
const geminiAPIController_1 = __importDefault(require("./geminiAPIController"));
const changePasswordController_1 = __importDefault(require("./changePasswordController"));
const walletDetailsController_1 = __importDefault(require("./walletDetailsController"));
const submitIssueController_1 = __importDefault(require("./submitIssueController"));
exports.default = (dependencies) => {
    return {
        registrationController: (0, registrationController_1.default)(dependencies),
        googleAuthController: (0, googleAuthController_1.default)(dependencies),
        verifyOtpController: (0, verifyOtpController_1.default)(dependencies),
        resendOTPController: (0, resendOTPController_1.default)(dependencies),
        loginController: (0, loginController_1.default)(dependencies),
        forgotPasswordController: (0, forgotPasswordController_1.default)(dependencies),
        resetPassword: (0, passwordResetController_1.default)(dependencies),
        resetPasswordOtpcontroller: (0, passwordOtpController_1.default)(dependencies),
        refreshTokenController: (0, refreshTokenController_1.refreshTokenController)(dependencies),
        userProfileController: (0, userProfileController_1.default)(dependencies),
        childTherapistController: (0, childTherapistController_1.default)(dependencies),
        slotManagementController: (0, slotManagementController_1.default)(dependencies),
        appointmentController: (0, appointmentController_1.default)(dependencies),
        bookingStatusController: (0, bookingStatusController_1.default)(dependencies),
        sessionsViewController: (0, sessionsViewController_1.default)(dependencies),
        completedBookingController: (0, completedBookingController_1.default)(dependencies),
        cancelledBookingController: (0, cancelledBookingController_1.default)(dependencies),
        appointmentBookedController: (0, appointmentBookedController_1.default)(dependencies),
        searchTherapistsController: (0, searchTherapistsController_1.default)(dependencies),
        childTherapistSorting: (0, childTherapistSorting_1.default)(dependencies),
        paymentManagementController: (0, paymentManagementController_1.default)(dependencies),
        verifyPaymentController: (0, verifyPaymentController_1.default)(dependencies),
        joinVideoController: (0, joinVideoController_1.default)(dependencies),
        searchChildTherapistController: (0, searchChildTherapistController_1.default)(dependencies),
        cancelAppointment: (0, cancelAppointment_1.default)(dependencies),
        geminiAPIController: (0, geminiAPIController_1.default)(dependencies),
        changePasswordController: (0, changePasswordController_1.default)(dependencies),
        walletDetailsController: (0, walletDetailsController_1.default)(dependencies),
        submitIssueController: (0, submitIssueController_1.default)(dependencies),
    };
};
