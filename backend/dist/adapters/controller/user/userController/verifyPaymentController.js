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
    const { savePaymentUsecase } = dependencies.useCase;
    const verifyPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { therapistId, userId, slot, notes, totalAmount, paymentStatus, paymentDetails } = req.body;
            // First, execute the use case (this is your existing business logic)
            const paymentData = yield savePaymentUsecase(dependencies).executeFunction({
                therapistId,
                userId,
                slot,
                notes,
                totalAmount,
                paymentStatus,
                paymentDetails
            });
            if (!paymentData || !paymentData.status) {
                return res.status(400).json({ status: false, message: httpStatusCode_1.ResponseMessages.PAYMENT_CREATION_FAILED });
            }
            // Send the order details to the frontend
            res.status(httpStatusCode_1.HttpStatusCode.OK).json({
                status: true, message: httpStatusCode_1.ResponseMessages.SUCCESSFULLY_CREATED_PAYMENT, paymentId: paymentData.paymentId
            });
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return verifyPaymentController;
};
