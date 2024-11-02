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
    const executeFunction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ therapistId, userId, slot, notes, totalAmount, paymentStatus, paymentDetails, }) {
        try {
            // Validate required fields
            if (!therapistId || !userId || !totalAmount || !paymentDetails) {
                throw new Error("Missing required payment details.");
            }
            // Fetch therapist fees
            const therapistDetails = yield userRepository.getTherapistDetails(therapistId);
            if (!therapistDetails || !therapistDetails.data.fees) {
                throw new Error("Unable to retrieve therapist fees.");
            }
            const therapistFees = therapistDetails.data.fees;
            // Prepare payment data for saving
            const paymentData = {
                therapistId,
                userId,
                slot,
                notes,
                totalAmount,
                razorpayOrderId: paymentDetails.paymentDetails.razorpay_order_id,
                amount: therapistFees,
                currency: 'INR',
                status: paymentStatus === 'success' ? 'completed' : 'failed',
                paymentMethod: 'razorpay',
                paymentStatus,
            };
            // Only save payment details if paymentStatus is success
            if (paymentStatus === 'success') {
                const savePaymentResponse = yield userRepository.savePayment(paymentData);
                // Check if payment was saved successfully
                if (savePaymentResponse.status) {
                    return {
                        status: true,
                        paymentId: savePaymentResponse.paymentId,
                        appointmentData: {
                            razorpayOrderId: paymentDetails.paymentDetails.razorpay_order_id,
                            amount: totalAmount,
                            currency: 'INR',
                        },
                    };
                }
                else {
                    return { status: false, message: httpStatusCode_1.ResponseMessages.FAILED_TO_SAVE_PAYMENT_dATA };
                }
            }
            else {
                // Return response indicating payment was not successful
                return {
                    status: false,
                    message: httpStatusCode_1.ResponseMessages.PAYMENT_NOT_SUCCESSFUL,
                };
            }
        }
        catch (error) {
            return {
                status: false,
                message: error.message || httpStatusCode_1.ResponseMessages.PAYMENT_CREATION_FAILED,
            };
        }
    });
    return { executeFunction };
};
