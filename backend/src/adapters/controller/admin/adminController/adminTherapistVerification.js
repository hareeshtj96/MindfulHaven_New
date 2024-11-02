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
const httpStatusCode_1 = require("../../../../utils/httpStatusCode");
const nodemailer_1 = require("../../../../utils/nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
exports.default = (dependencies) => {
    const { getVerifiedUsecase } = dependencies.useCase;
    const adminTherapistVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const therapistId = req.params.id;
            if (!therapistId) {
                return res.status(400).json({ status: false, message: httpStatusCode_1.ResponseMessages.THERAPIST_ID_REQUIRED });
            }
            const response = yield getVerifiedUsecase(dependencies).executeFunction(therapistId);
            if (response && response.status) {
                const therapist = response.data;
                const isVerified = therapist.isVerified;
                //send email notification
                const emailResponse = yield (0, nodemailer_1.sendVerificationEmail)(therapist.therapist.email, therapist.therapist.name, therapist.therapist.isVerified);
                if (!emailResponse.status) {
                    console.error("Failed to send email:", emailResponse.message);
                }
                return res.status(httpStatusCode_1.HttpStatusCode.OK).json({ status: true, data: response.data });
            }
            else {
                return res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ status: false, message: httpStatusCode_1.ResponseMessages.DATA_NOT_FOUND });
            }
        }
        catch (error) {
            return res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return adminTherapistVerificationController;
};
