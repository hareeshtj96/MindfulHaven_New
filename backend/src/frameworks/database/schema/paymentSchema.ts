import mongoose, { Schema, model } from "mongoose";

const paymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    therapistId: {
        type: Schema.Types.ObjectId,
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

const Payment = model('Payment', paymentSchema);

export { Payment, paymentSchema }