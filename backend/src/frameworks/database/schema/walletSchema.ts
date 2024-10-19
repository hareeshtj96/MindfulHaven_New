import mongoose, { Schema, model } from "mongoose";

const walletSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    balance: {
        type: Number, 
        required: true,
        default: 0.00
    },
    currency: {
        type: String,
        enum: ['USD', 'INR', ],
        default: 'INR'
    },
    transactionHistory: [
        {
            transactionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Transaction'
            },
            type: {
                type: String,
                enum: ['credit', 'debit', 'refund'],
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['pending', 'completed', 'failed'],
                default: 'completed'
            }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Wallet = model('Wallet', walletSchema);

export {
    Wallet
}