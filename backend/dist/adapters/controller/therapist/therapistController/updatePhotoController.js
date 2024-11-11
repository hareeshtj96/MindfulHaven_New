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
exports.default = (dependencies) => {
    const { therapistPhotoUsecase } = dependencies.useCase;
    const updatePhotoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const therapistId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.therapistId;
            if (!therapistId) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: httpStatusCode_1.ResponseMessages.THERAPIST_ID_REQUIRED });
            }
            const updateResult = yield therapistPhotoUsecase(dependencies).executeFunction(therapistId, req.files);
            if (!updateResult) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: httpStatusCode_1.ResponseMessages.FAILED_TO_UPDATE_THERAPIST_PHOTO });
            }
            res.status(httpStatusCode_1.HttpStatusCode.OK).json({ status: true, message: httpStatusCode_1.ResponseMessages.PHOTO_UPDATED, data: updateResult });
        }
        catch (error) {
            return res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return updatePhotoController;
};
