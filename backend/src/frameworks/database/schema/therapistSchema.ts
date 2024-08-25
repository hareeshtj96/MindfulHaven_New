import mongoose, { Schema, model } from "mongoose";

const therapistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String, 
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    educationalQualifications: {
        type: [String],
        required: true,
    },
    identityProof: {
        type: String, 
    },
    counsellingQualification: {
        type: String,
        required: true,
    },
    professionalExperience: {
        type: String,
        required: true,
    },
    establishment: {
        type: String,
    },
    location: {
        type: String,
    },
    timings: {
        type: String,
    },
    fees: {
        type: Number,
    },
    photo: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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
});

const Therapist = model('Therapist', therapistSchema);

export { Therapist };
