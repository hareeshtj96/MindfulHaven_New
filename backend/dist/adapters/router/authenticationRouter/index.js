"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../../controller");
const accessTokenMiddleware_1 = require("../../../middleware/accessTokenMiddleware");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage }).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'identityProof', maxCount: 1 }
]);
exports.default = (dependencies) => {
    const router = (0, express_1.default)();
    const { registrationController, verifyOtpController, resendOTPController, loginController, googleAuthController, forgotPasswordController, resetPassword, resetPasswordOtpcontroller, refreshTokenController, userProfileController, childTherapistController, slotManagementController, appointmentController, bookingStatusController, sessionsViewController, completedBookingController, cancelledBookingController, appointmentBookedController, searchTherapistsController, childTherapistSorting, paymentManagementController, verifyPaymentController, joinVideoController, searchChildTherapistController, cancelAppointment, geminiAPIController, changePasswordController, walletDetailsController, submitIssueController, familyTherapistController, searchFamilyTherapistController, familyTherapistSorting, individualTherapistController, individualTherapistSorting, searchIndividualTherapistController, coupleTherapistController, coupleTherapistSorting, checkSlotsBeforePaymentController } = (0, controller_1.userController)(dependencies);
    router.post('/register', registrationController);
    router.post('/register_google_auth', googleAuthController);
    router.post('/verify_otp', verifyOtpController);
    router.post('/resend_OTP', resendOTPController);
    router.post('/login', loginController);
    router.post('/forgot_password', forgotPasswordController);
    router.post('/forgot_password_otp', resetPasswordOtpcontroller);
    router.post('/password_reset', resetPassword);
    router.post('/refresh_token', refreshTokenController);
    router.get("/user_profile", accessTokenMiddleware_1.verifyAccessToken, userProfileController);
    router.get("/childTherapy", childTherapistController);
    router.get('/slot_management/:id', slotManagementController);
    router.get('/booked_slots/:id', appointmentBookedController);
    router.post('/create_appointment', appointmentController);
    router.get('/booking_status/:id', bookingStatusController);
    router.get('/booking_details', accessTokenMiddleware_1.verifyAccessToken, sessionsViewController);
    router.get('/booking_Completeddetails', accessTokenMiddleware_1.verifyAccessToken, completedBookingController);
    router.get('/booking_Cancelleddetails', accessTokenMiddleware_1.verifyAccessToken, cancelledBookingController);
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
    router.get('/checkSlotBeforePayment/:id', checkSlotsBeforePaymentController);
    return router;
};
