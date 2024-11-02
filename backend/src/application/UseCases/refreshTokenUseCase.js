"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateToken_1 = __importStar(require("../../utils/generateToken"));
const httpStatusCode_1 = require("../../utils/httpStatusCode");
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
exports.default = (dependencies) => {
    const { userRepository } = dependencies.repository;
    const executionFunction = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const decoded = (0, generateToken_1.verifyToken)(refreshToken);
            const userId = decoded.userId;
            if (!userId) {
                return { status: false, message: httpStatusCode_1.ResponseMessages.INVALID_TOKEN_PAYLOAD };
            }
            const User = yield userRepository.getUserByEmail(userId.email);
            if (!User) {
                return { status: false, message: httpStatusCode_1.ResponseMessages.USER_NOT_FOUND };
            }
            if (User.isBlocked) {
                return { status: false, message: httpStatusCode_1.ResponseMessages.USER_IS_BLOCKED };
            }
            const { accessToken, refreshToken: newRefreshToken } = (0, generateToken_1.default)({ userId });
            return { status: true, data: { accessToken, refreshToken: newRefreshToken } };
        }
        catch (error) {
            return { status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR };
        }
    });
    return { executionFunction };
};
