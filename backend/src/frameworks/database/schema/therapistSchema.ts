import mongoose, { Schema, model } from "mongoose";



const bookedSlotSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false, 
    },
    reservedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        default: null,
    },
    reservedUntil: {
        type: Date, 
        default: null,
    },
});

const therapistSchema = new Schema({
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
         
        },
        startTime: {
            type: String,
    
        },
        endTime: {
            type: String,
    
        },
    }],
    availableSlots: [Date],

    booked: {
        type: [bookedSlotSchema],
        default: [],
    },
    
    updatedAvailableSlots: [Date],

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
        slots: [
            {
                startTime: {
                    type: String,
                    required: true,
                },
                endTime: {
                    type: String,
                    required: true,
                },
            }
        ]
        
    }],
});

const Therapist = model('Therapist', therapistSchema);

export { Therapist };
