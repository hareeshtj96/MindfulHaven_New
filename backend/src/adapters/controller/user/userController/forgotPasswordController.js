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
exports.default = forgotPassword;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const httpStatusCode_1 = require("../../../../utils/httpStatusCode");
dotenv_1.default.config();
function forgotPassword(dependencies) {
    const { forgotPassword } = dependencies.useCase;
    const forgotPasswordController = (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const forgot = yield forgotPassword(dependencies);
            const result = yield forgot.executionFunction({ email });
            if (result.status) {
                const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
                const token = jsonwebtoken_1.default.sign({ otp: result.otp, email }, SECRET_KEY, { expiresIn: '10m' });
                res.json({ status: true, message: httpStatusCode_1.ResponseMessages.OTP_SENT_TO_MAIL, token });
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: result.data });
            }
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return forgotPasswordController;
}
