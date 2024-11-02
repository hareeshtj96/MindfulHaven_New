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
exports.default = userRegistrationGoogle;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const httpStatusCode_1 = require("../../utils/httpStatusCode");
const SECRET_KEY = process.env.JWT_SECRET || 'undefined';
function userRegistrationGoogle(dependencies) {
    const { userRepository } = dependencies.repository;
    const executionFunction = (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = data;
            const userExists = yield userRepository.getUserByEmail({ email });
            if (userExists.status) {
                console.log("user already exists error triggered:");
                return { status: false, data: httpStatusCode_1.ResponseMessages.USER_ALREADY_EXISTS };
            }
            const response = yield userRepository.createUser(data);
            if (response.status) {
                const token = jsonwebtoken_1.default.sign({ userData: data }, SECRET_KEY, { expiresIn: '10m' });
                return { status: true, token };
            }
            else {
                return { status: false, data: response.message };
            }
        }
        catch (error) {
            return { status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR };
        }
    });
    return {
        executionFunction: executionFunction
    };
}
