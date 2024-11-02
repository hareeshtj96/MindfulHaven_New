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
const httpStatusCode_1 = require("../../utils/httpStatusCode");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
function resetPassword(dependencies) {
    const { userRepository } = dependencies.repository;
    const executionFunction = (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, newPassword, confirmPassword } = data;
            // Check if passwords match
            if (newPassword !== confirmPassword) {
                return { status: false, data: httpStatusCode_1.ResponseMessages.PASSWORD_DO_NOT_MATCH };
            }
            // Hash the new password
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, SALT_ROUNDS);
            // Update the password in the database
            const updateResult = yield userRepository.updateUserPassword({ email, hashedPassword });
            if (!updateResult.status) {
                return { status: false, data: httpStatusCode_1.ResponseMessages.FAILED_TO_RESET_PASSWORD };
            }
            return { status: true, data: httpStatusCode_1.ResponseMessages.PASSWORD_RESET_SUCCESSFULLY };
        }
        catch (error) {
            return { status: false, data: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR };
        }
    });
    return {
        executionFunction: executionFunction
    };
}
