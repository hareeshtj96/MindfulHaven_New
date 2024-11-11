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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
exports.default = (dependencies) => {
    const { getuserBlockUsecase } = dependencies.useCase;
    const adminUserblockController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            if (!userId) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: httpStatusCode_1.ResponseMessages.USER_ID_REQUIRED });
            }
            const response = yield getuserBlockUsecase(dependencies).executeFunction(userId);
            if (response && response.status) {
                return res.status(httpStatusCode_1.HttpStatusCode.OK).json({ status: true, data: response.data });
            }
            else {
                return res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ status: false, message: httpStatusCode_1.ResponseMessages.DATA_NOT_FOUND });
            }
        }
        catch (error) {
            return res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return adminUserblockController;
};
