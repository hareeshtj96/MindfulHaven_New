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
    const { userRegistration } = dependencies.useCase;
    const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password, mobile, role } = req.body;
            const userData = { name, email, password, mobile, role };
            // Invoke the registration use case
            const registrationFunction = yield userRegistration(dependencies);
            const response = yield registrationFunction.executionFunction(userData);
            if (response.status) {
                const encodedToken = response.token;
                // Verify and decode the token
                const decodedToken = jsonwebtoken_1.default.verify(encodedToken, SECRET_KEY);
                // Generate a new token
                const token = jsonwebtoken_1.default.sign({ otp: decodedToken.otp, userData: { name, email, role, password, mobile } }, SECRET_KEY, { expiresIn: '10m' });
                res.json({ status: true, token });
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, data: response.data });
            }
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return registerController;
};
