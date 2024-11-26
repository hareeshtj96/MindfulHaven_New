"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatusCode_1 = require("../../../../utils/httpStatusCode");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "default";
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;
if (!REFRESH_SECRET_KEY) {
    throw new Error('REFRESH_SECRET_KEY is not defined in the environment');
}
const refreshTokenController = (dependencies) => {
    console.log("entered refresh token controller........");
    return (req, res) => {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            return res.status(httpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ message: httpStatusCode_1.ResponseMessages.REFRESH_TOKEN_NOT_PROVIDED });
        }
        // Verify refresh token
        jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(httpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ message: httpStatusCode_1.ResponseMessages.INVALID_REFRESH_TOKEN });
            }
            // Check if decoded is JwtPayload to access its properties
            if (decoded && typeof decoded !== 'string') {
                const { email, role } = decoded;
                // Generate new access token
                const newAccessToken = jsonwebtoken_1.default.sign({ email, role }, SECRET_KEY, { expiresIn: '20m' });
                // Generate new refresh token
                const newRefreshToken = jsonwebtoken_1.default.sign({ email, role }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
                // Set the new refresh token as a cookie
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
                return res.json({ accessToken: newAccessToken });
            }
            return res.status(httpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ message: httpStatusCode_1.ResponseMessages.INVALID_REFRESH_TOKEN_PAYLOAD });
        });
    };
};
exports.refreshTokenController = refreshTokenController;
