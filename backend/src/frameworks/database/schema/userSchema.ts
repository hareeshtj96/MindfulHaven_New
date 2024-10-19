import mongoose, { Schema, model } from "mongoose";
import { Wallet } from "./walletSchema";

const userSchema = new Schema({
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['therapist', 'user'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Wallet'
    }

    
})

const User = model('User', userSchema);

export {
    User
}