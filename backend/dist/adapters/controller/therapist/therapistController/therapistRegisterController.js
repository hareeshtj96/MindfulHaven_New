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
    const { therapistRegistration } = dependencies.useCase;
    const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password, role } = req.body;
            const data = { name, email, password, role };
            const response = yield therapistRegistration(dependencies);
            const execute = yield response.executionFunction(data);
            if (execute.status) {
                const encodedToken = execute.token;
                if (!encodedToken) {
                    throw new Error("JWT token was not provided by therapistRegistration");
                }
                if (jsonwebtoken_1.default.verify(encodedToken, SECRET_KEY)) {
                    const decodedToken = jsonwebtoken_1.default.decode(encodedToken);
                    const newToken = jsonwebtoken_1.default.sign({ otp: decodedToken.otp, TherapistData: decodedToken.TherapistData }, SECRET_KEY, { expiresIn: '10d' });
                    res.json({ status: true, token: newToken });
                }
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, data: execute.data });
            }
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return registerController;
};
