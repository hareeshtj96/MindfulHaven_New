import mongoose, { Schema, model } from "mongoose";
import { paymentSchema } from "./paymentSchema";

const appointmentSchema = new Schema({
    therapistId: {
        type: Schema.Types.ObjectId,
        ref: 'Therapist',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
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
    payment: paymentSchema
});

const Appointment = model('Appointment', appointmentSchema);

export { Appointment }