"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Therapist = void 0;
const mongoose_1 = require("mongoose");
const bookedSlotSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        enum: [
            '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
            '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
            '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
        ],
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    }
});
const therapistSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    specialization: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'other',
        required: false,
    },
    educationalQualifications: {
        type: [String],
        required: false,
    },
    identityProof: {
        type: String,
    },
    counsellingQualification: {
        type: String,
        required: false,
    },
    professionalExperience: {
        type: String,
        required: false,
    },
    establishment: {
        type: String,
    },
    location: {
        type: String,
    },
    timings: [{
            dayOfWeek: {
                type: [Number],
                required: true,
            },
            startTime: {
                type: String,
                required: true,
            },
            endTime: {
                type: String,
                required: true,
            },
        }],
    availableSlots: [Date],
    booked: {
        type: [bookedSlotSchema],
        default: [],
    },
    fees: {
        type: Number,
    },
    photo: {
        type: String,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ['therapist', 'user'],
        default: 'therapist',
    },
    updatedTimings: [{
            date: {
                type: Date,
                required: true,
            },
            startTime: {
                type: String,
                required: true,
            },
            endTime: {
                type: String,
                required: true,
            },
        }],
});
const Therapist = (0, mongoose_1.model)('Therapist', therapistSchema);
exports.Therapist = Therapist;
