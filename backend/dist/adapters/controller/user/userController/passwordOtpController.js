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
const dotenv_1 = __importDefault(require("dotenv"));
const httpStatusCode_1 = require("../../../../utils/httpStatusCode");
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
exports.default = (dependencies) => {
    const resetPasswordOtpcontroller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            catch (error) {
                return res.status(401).json({ status: false, message: httpStatusCode_1.ResponseMessages.TOKEN_EXPIRED });
            }
            if (decoded.otp === otp) {
                const email = decoded.email;
                res.json({ status: true, message: httpStatusCode_1.ResponseMessages.OTP_VERIFIED_YOU_CAN_RESET_PASSWORD, email });
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: httpStatusCode_1.ResponseMessages.INCORRECT_OTP });
            }
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return resetPasswordOtpcontroller;
};
