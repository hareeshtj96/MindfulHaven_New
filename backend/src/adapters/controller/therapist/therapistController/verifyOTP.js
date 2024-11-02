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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatusCode_1 = require("../../../../utils/httpStatusCode");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
exports.default = (dependencies) => {
    const { therapistRepository } = dependencies.repository;
    const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { otp } = req.body;
            const authHeader = req.headers.authorization;
            const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
            if (!token) {
                return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.TOKEN_MISSING });
            }
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            }
            catch (err) {
                return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.TOKEN_EXPIRED });
            }
            // Compare the OTP from the token with the OTP provided in the request body
            if (decoded.otp === otp) {
                const therapistData = decoded.TherapistData;
                if (!therapistData) {
                    return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: httpStatusCode_1.ResponseMessages.USER_DATA_MISSING });
                }
                try {
                    const result = yield therapistRepository.createtherapist(therapistData);
                    res.json({ status: true, message: httpStatusCode_1.ResponseMessages.OTP_VERIFIED_THERAPIST_sAVED, data: result });
                }
                catch (dbError) {
                    res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.FAILED_TO_SAVE_THERAPIST_DATA });
                }
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: httpStatusCode_1.ResponseMessages.INCORRECT_OTP });
            }
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return verifyOtp;
};
