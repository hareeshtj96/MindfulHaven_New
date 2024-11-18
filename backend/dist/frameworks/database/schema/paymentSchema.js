"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    therapistId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Therapist',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    convenienceFee: {
        type: Number,
        default: 80
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['creditCard', 'debitCard', 'razorpay', 'upi', 'netBanking', 'wallet'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'success', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        trim: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    refundRequest: {
        type: Boolean,
        default: false
    },
    refundReason: {
        type: String,
        trim: true
    },
    refundProcessedAt: {
        type: Date
    }
});
exports.paymentSchema = paymentSchema;
const Payment = (0, mongoose_1.model)('Payment', paymentSchema);
exports.Payment = Payment;
