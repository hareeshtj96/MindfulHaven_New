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
const httpStatusCode_1 = require("../../utils/httpStatusCode");
const therapistRouter_1 = require("../../adapters/router/authenticationRouter/therapistRouter");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bucketName = process.env.BUCKET_NAME || "";
exports.default = (dependencies) => {
    const { therapistRepository } = dependencies.repository;
    const executeFunction = (therapistId, files) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!files || !files['photo']) {
                return { status: false, message: httpStatusCode_1.ResponseMessages.PHOTO_MISSING };
            }
            const newPhoto = files['photo'][0];
            const photoUrl = yield (0, therapistRouter_1.uploadFileToS3)(newPhoto, bucketName, "therapists/photos");
            const response = yield therapistRepository.uploadPhoto(therapistId, photoUrl);
            if (response.status) {
                return { status: true, data: response.data };
            }
            else {
                return { status: false, message: response.message };
            }
        }
        catch (error) {
            return { status: false, message: httpStatusCode_1.ResponseMessages.ERROR_IN_THERAPIST_USECASE };
        }
    });
    return { executeFunction };
};
