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
    const { getPaymentUsecase } = dependencies.useCase;
    const paymentManagementController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { therapistId, userId, slot, notes, totalAmount } = req.body;
            // First, execute the use case (this is your existing business logic)
            const paymentData = yield getPaymentUsecase(dependencies).executeFunction({
                therapistId,
                userId,
                slot,
                notes,
                totalAmount,
            });
            if (!paymentData || !paymentData.status) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ status: false, message: httpStatusCode_1.ResponseMessages.PAYMENT_CREATION_FAILED });
            }
            // Send the order details to the frontend
            res.status(httpStatusCode_1.HttpStatusCode.OK).json({
                status: true,
                razorpayOrderId: paymentData.appointmentData.razorpayOrderId,
                amount: paymentData.appointmentData.amount,
                currency: paymentData.appointmentData.currency
            });
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return paymentManagementController;
};
