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
const utils_1 = require("../../../../utils");
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
exports.default = (dependencies) => {
    const { userRepository } = dependencies.repository;
    const resendOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.AUTHORIZATION_HEAD_MISSING });
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.TOKEN_MISSING });
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            const email = decodedToken.userData.email;
            if (!email) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: httpStatusCode_1.ResponseMessages.EMAIL_NOT_FOUND_IN_TOKEN });
            }
            const response = yield (0, utils_1.SendOtp)(email);
            if (!response.status) {
                return res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.FAILED_TO_SENT_OTP });
            }
            const newToken = jsonwebtoken_1.default.sign({ otp: response.otp, userData: { email } }, SECRET_KEY, { expiresIn: "10m" });
            res.json({ status: true, message: httpStatusCode_1.ResponseMessages.OTP_RESENT_SUCCESSFULLY, token: newToken });
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return resendOtpController;
};
