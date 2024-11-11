"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.therapistTokenAuthenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const httpStatusCode_1 = require("../utils/httpStatusCode");
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "secret_key";
const therapistTokenAuthenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.AUTHORIZATION_HEAD_MISSING });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.TOKEN_MISSING });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = { therapistId: decodedToken.therapistId };
        next();
    }
    catch (error) {
        return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.INVALID_TOKEN_PAYLOAD });
    }
};
exports.therapistTokenAuthenticate = therapistTokenAuthenticate;
