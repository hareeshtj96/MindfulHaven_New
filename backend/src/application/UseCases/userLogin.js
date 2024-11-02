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
const httpStatusCode_1 = require("../../utils/httpStatusCode");
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "undefined";
function userLogin(dependencies) {
    const { userRepository } = dependencies.repository;
    const executionFunction = (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = data;
            const user = yield userRepository.getUserByEmail({ email });
            if (!user.status) {
                return { status: false, data: httpStatusCode_1.ResponseMessages.INVALID_EMAIL_OR_PASSWORD };
            }
            //verify the password
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.data.password);
            if (!isPasswordValid) {
                return { status: false, data: httpStatusCode_1.ResponseMessages.INVALID_EMAIL_OR_PASSWORD };
            }
            const token = jsonwebtoken_1.default.sign({ userData: { id: user.data.id, email: user.data.email } }, SECRET_KEY, { expiresIn: "1h" });
            return { status: true, token };
        }
        catch (error) {
            return { status: false, data: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR };
        }
    });
    return {
        executionFunction: executionFunction
    };
}
