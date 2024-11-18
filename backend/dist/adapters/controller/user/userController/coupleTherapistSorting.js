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
    const { sortCoupleTherapistUsecase } = dependencies.useCase;
    const coupleTherapistSorting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sortBy, page, limit } = req.query;
            const pageNumber = parseInt(page, 10) || 1;
            const limitNumber = parseInt(limit, 10) || 10;
            const response = yield sortCoupleTherapistUsecase(dependencies).executeFunction({
                sortBy,
                page: pageNumber,
                limit: limitNumber
            });
            if (response && response.status) {
                res.status(httpStatusCode_1.HttpStatusCode.OK).json({ status: true, data: response.data });
            }
            else {
                res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message });
            }
        }
        catch (error) {
            return res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return coupleTherapistSorting;
};
