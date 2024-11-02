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
exports.default = userLogin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const httpStatusCode_1 = require("../../../../utils/httpStatusCode");
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
function userLogin(dependencies) {
    const { userRepository } = dependencies.repository;
    const loginController = (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // Find the user by email
            const user = yield userRepository.getUserByEmail({ email });
            if (!user.status) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: httpStatusCode_1.ResponseMessages.USER_NOT_FOUND });
            }
            if (user.data.isBlocked) {
                return res.status(httpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ message: httpStatusCode_1.ResponseMessages.USER_IS_BLOCKED });
            }
            // Compare provided password with the stored hashed password
            const validPassword = yield bcryptjs_1.default.compare(password, user.data.password);
            if (!validPassword) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: httpStatusCode_1.ResponseMessages.INVALID_PASSWORD });
            }
            // Generate JWT token upon successful login
            const token = jsonwebtoken_1.default.sign({ userId: user.data._id, email: user.data.email, name: user.data.name, role: user.data.role, mobile: user.data.mobile }, SECRET_KEY, { expiresIn: "20m" });
            // Generate Refresh token
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user.data._id, email: user.data.email, name: user.data.name, role: user.data.role }, REFRESH_SECRET_KEY, { expiresIn: "7d" });
            // Set Refresh token in HTTP-only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            // Send response
            res.json({ status: true, token });
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return loginController;
}
;
