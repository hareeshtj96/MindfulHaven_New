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
exports.default = resetPassword;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const httpStatusCode_1 = require("../../../../utils/httpStatusCode");
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
function resetPassword(dependencies) {
    const { resetPassword } = dependencies.useCase;
    const resetPasswordController = (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { newPassword, confirmPassword } = req.body;
            // Extract token from Authorization header
            const authHeader = req.headers.authorization;
            const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
            if (!token) {
                return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.TOKEN_MISSING });
            }
            // Decode the token to extract the email
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            }
            catch (error) {
                return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.TOKEN_EXPIRED });
            }
            const email = decoded.email;
            if (!email) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: httpStatusCode_1.ResponseMessages.EMAIL_NOT_FOUND_IN_TOKEN });
            }
            // Pass the email along with new password and confirm password to the use case
            const forgot = resetPassword(dependencies);
            const result = yield forgot.executionFunction({ email, newPassword, confirmPassword });
            if (result.status) {
                res.json({ status: true, message: httpStatusCode_1.ResponseMessages.PASSWORD_RESET_SUCCESSFULLY });
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: result.data });
            }
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return resetPasswordController;
}
