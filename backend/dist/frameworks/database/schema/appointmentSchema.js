"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema_1 = require("./paymentSchema");
const appointmentSchema = new mongoose_1.Schema({
    therapistId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Therapist',
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slot: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true
    },
    cancellationRequest: {
        type: String,
        trim: true,
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    payment: paymentSchema_1.paymentSchema
});
const Appointment = (0, mongoose_1.model)('Appointment', appointmentSchema);
exports.Appointment = Appointment;
