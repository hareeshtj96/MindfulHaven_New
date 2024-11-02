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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
exports.default = (dependencies) => {
    const { getUserProfileUsecase } = dependencies.useCase;
    const userProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.AUTHORIZATION_HEAD_MISSING });
            }
            // Extract token from 'Bearer <token>' format
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.TOKEN_MISSING });
            }
            // Verify and decode the token
            const decodedToken = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            const email = decodedToken.email;
            if (!email) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: httpStatusCode_1.ResponseMessages.EMAIL_NOT_FOUND_IN_TOKEN });
            }
            const response = yield getUserProfileUsecase(dependencies).executeFunction({ email });
            if (response && response.status) {
                res.status(httpStatusCode_1.HttpStatusCode.OK).json({ status: true, data: response.data });
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ status: false, message: httpStatusCode_1.ResponseMessages.DATA_NOT_FOUND });
            }
        }
        catch (error) {
            return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.TOKEN_EXPIRED });
        }
    });
    return userProfileController;
};
