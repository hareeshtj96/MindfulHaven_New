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
const httpStatusCode_1 = require("../../utils/httpStatusCode");
exports.default = (dependencies) => {
    const { userRepository } = dependencies.repository;
    const executeFunction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ sortBy, page, limit }) {
        try {
            let sortCriteria = {};
            if (sortBy === "experience") {
                sortCriteria = { professionalExperience: -1 };
            }
            const sortedTherapists = yield userRepository.getSortedCoupleTherapists({ sortCriteria, page, limit });
            return { status: true, data: sortedTherapists };
        }
        catch (error) {
            return { status: false, message: httpStatusCode_1.ResponseMessages.ERROR_FETCHING_SORTED_THERAPIST };
        }
    });
    return { executeFunction };
};
