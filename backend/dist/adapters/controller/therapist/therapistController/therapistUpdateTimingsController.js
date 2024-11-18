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
    const { updateTherapistTimingsUsecase } = dependencies.useCase;
    const therapistUpdateTimingsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.UNAUTHORIZED });
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            const email = decodedToken.email;
            const { startTime, endTime, date } = req.body;
            const response = yield updateTherapistTimingsUsecase(dependencies).executeFunction({ email, startTime, endTime, date });
            if (response && response.status) {
                res.status(httpStatusCode_1.HttpStatusCode.OK).json({ status: true, message: response.message });
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.OK).json({ status: false, message: response.message });
            }
        }
        catch (error) {
            return res.status(httpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ status: false, message: httpStatusCode_1.ResponseMessages.TOKEN_EXPIRED });
        }
    });
    return therapistUpdateTimingsController;
};
