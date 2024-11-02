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
const generateZegoToken_1 = require("../../utils/generateZegoToken");
const httpStatusCode_1 = require("../../utils/httpStatusCode");
exports.default = (dependencies) => {
    const executeFunction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ therapistId, bookingId }) {
        try {
            const roomId = bookingId;
            const roomToken = (0, generateZegoToken_1.generateZegoToken)(therapistId, roomId);
            return { status: true, data: { roomId, roomToken } };
        }
        catch (error) {
            return { status: false, message: httpStatusCode_1.ResponseMessages.UNABLE_TO_JOIN_VIDEO };
        }
    });
    return { executeFunction };
};
