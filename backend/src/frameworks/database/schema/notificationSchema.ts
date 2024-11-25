import mongoose, { Schema, model } from "mongoose";

const notificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    message: {
        type: String,
        required: true, 
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'success', 'error'], 
        default: 'info',
    },
    isRead: {
        type: Boolean,
        default: false, 
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    link: {
        type: String, 
    },
});

const Notification = model('Notification', notificationSchema);

export {
    Notification
};
