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
    const { fetchTherapistUsecase } = dependencies.useCase;
    const fetchProfitTherapist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { therapistId } = req.query;
            console.log("therapost id in contrller:", therapistId);
            const response = yield fetchTherapistUsecase(dependencies).executeFunction(therapistId);
            console.log("response from controller:", response);
            if (response && response.status) {
                res.status(httpStatusCode_1.HttpStatusCode.OK).json({
                    status: true,
                    totalProfit: response.totalProfit,
                    mostBookedHour: response.mostBookedHour,
                    userName: response.userName,
                });
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ status: false, message: httpStatusCode_1.ResponseMessages.DATA_NOT_FOUND });
            }
        }
        catch (error) {
            console.error("Error in contoller:", error);
            return res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return fetchProfitTherapist;
};