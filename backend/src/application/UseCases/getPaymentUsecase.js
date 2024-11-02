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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const httpStatusCode_1 = require("../../utils/httpStatusCode");
exports.default = (dependencies) => {
    const { userRepository } = dependencies.repository;
    // Initialize Razorpay instance
    const razorpay = new razorpay_1.default({
        key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
    });
    const executeFunction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ therapistId, userId, slot, notes, totalAmount }) {
        try {
            if (!therapistId || !userId || !totalAmount) {
                throw new Error("Missing required payment details.");
            }
            // Create an order with Razorpay
            const razorpayOrder = yield razorpay.orders.create({
                amount: totalAmount * 100,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                payment_capture: true,
            });
            return {
                status: true,
                appointmentData: {
                    razorpayOrderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                },
            };
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
