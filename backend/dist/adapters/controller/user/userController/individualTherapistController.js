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
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = require("../../../../utils/httpStatusCode");
exports.default = (dependencies) => {
    const { getIndividualTherapistUsecase } = dependencies.useCase;
    const individualTherapistController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const response = yield getIndividualTherapistUsecase(dependencies).executeFunction({ page, limit });
            if (response && response.status) {
                res.status(httpStatusCode_1.HttpStatusCode.OK).json({ status: true, data: response.data });
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ status: false, message: httpStatusCode_1.ResponseMessages.INDIVIDUAL_THERAPIST_NOT_FOUND });
            }
        }
        catch (error) {
            return res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return individualTherapistController;
};
