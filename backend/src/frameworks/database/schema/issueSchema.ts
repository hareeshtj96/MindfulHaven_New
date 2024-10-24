import mongoose, { Schema, model, mongo } from "mongoose";

const issueSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    therapistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Therapist',
        required: false,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['general', 'payment', 'therapist', 'technical'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'resolved'],
        default: 'pending',
    },
    raisedAt: {
        type: Date,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const Issue = model('Issue', issueSchema)

export {
    Issue
}