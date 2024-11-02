"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../../controller");
const roleMiddleware_1 = __importDefault(require("../../../middleware/roleMiddleware"));
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
    const { therapistRegisterController, verifyOTP, therapistLogin, therapistDetailsController, getTherapistProfile, getBookingsController, therapistUpdateTimingsController, therapistVideoController, cancelAppointmentTherapist, getAvailableDetails, cancelSlotController } = (0, controller_1.therapistController)(dependencies);
    router.post('/therapist_register', therapistRegisterController);
    router.post('/therapist_OTP', verifyOTP);
    router.post('/therapist_login', therapistLogin);
    router.put('/therapist_details', upload, therapistDetailsController);
    router.get('/therapist_profile', getTherapistProfile);
    router.get('/therapist_bookings/:id', getBookingsController);
    router.put('/therapist_updateTimings', therapistUpdateTimingsController);
    router.post('/therapist_video_call', therapistVideoController);
    router.patch('/therapist_cancelAppointment', cancelAppointmentTherapist);
    router.get('/therapist_availableDetails', getAvailableDetails);
    router.put('/therapist_cancelSlot', cancelSlotController);
    router.use('/*', (0, roleMiddleware_1.default)(['therapist']));
    return router;
};
