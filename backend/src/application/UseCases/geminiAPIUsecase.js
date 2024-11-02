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
const geminiAPI_1 = require("../../utils/geminiAPI");
const httpStatusCode_1 = require("../../utils/httpStatusCode");
exports.default = (dependencies) => {
    const executeFunction = (requestData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { query } = requestData;
            const response = yield (0, geminiAPI_1.run)(query);
            if (response) {
                return { status: true, data: response };
            }
            else {
                return { status: false, message: httpStatusCode_1.ResponseMessages.NO_RESPONSE_FROM_GEMINI };
            }
        }
        catch (error) {
            return { status: false, message: httpStatusCode_1.ResponseMessages.ERROR_IN_GEMINI_USECASE };
        }
    });
    return { executeFunction };
};
