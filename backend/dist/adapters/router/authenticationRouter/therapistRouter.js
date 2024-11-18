"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToS3 = uploadFileToS3;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../../controller");
const roleMiddleware_1 = __importDefault(require("../../../middleware/roleMiddleware"));
const therapistTokenAuthentication_1 = require("../../../middleware/therapistTokenAuthentication");
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const bucketAcessKey = process.env.BUCKET_ACCESS_KEY_ID;
const bucketSecret = process.env.BUCKET_ACCESS_SECRET_KEY;
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: bucketAcessKey !== null && bucketAcessKey !== void 0 ? bucketAcessKey : "",
        secretAccessKey: bucketSecret !== null && bucketSecret !== void 0 ? bucketSecret : "",
    },
    region: bucketRegion
});
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage }).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'identityProof', maxCount: 1 }
]);
function uploadFileToS3(file_1, bucketName_1) {
    return __awaiter(this, arguments, void 0, function* (file, bucketName, folder = "") {
        const fileName = `${Date.now()}-${file.originalname}`;
        const params = {
            Bucket: bucketName,
            Key: `${folder}/${fileName}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        try {
            yield s3.send(new client_s3_1.PutObjectCommand(params));
            return `https://${bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${folder}/${fileName}`;
        }
        catch (error) {
            console.error("Error in upload file to s3:", error);
            throw error;
        }
    });
}
exports.default = (dependencies) => {
    const router = (0, express_1.default)();
    const { therapistRegisterController, verifyOTP, therapistLogin, therapistDetailsController, getTherapistProfile, getBookingsController, therapistUpdateTimingsController, therapistVideoController, cancelAppointmentTherapist, getAvailableDetails, cancelSlotController, updatePhotoController, fetchProfitTherapist } = (0, controller_1.therapistController)(dependencies);
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
    router.put('/updatePhoto', upload, therapistTokenAuthentication_1.therapistTokenAuthenticate, updatePhotoController);
    router.get('/fetchProfit', fetchProfitTherapist);
    router.use('/*', (0, roleMiddleware_1.default)(['therapist']));
    return router;
};
