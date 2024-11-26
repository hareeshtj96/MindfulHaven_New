"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = require("./userSchema");
const adminSchema_1 = require("./adminSchema");
const therapistSchema_1 = require("./therapistSchema");
const appointmentSchema_1 = require("./appointmentSchema");
const paymentSchema_1 = require("./paymentSchema");
const walletSchema_1 = require("./walletSchema");
const issueSchema_1 = require("./issueSchema");
const notificationSchema_1 = require("./notificationSchema");
const databaseSchema = {
    User: userSchema_1.User,
    Admin: adminSchema_1.Admin,
    Therapist: therapistSchema_1.Therapist,
    Appointment: appointmentSchema_1.Appointment,
    Payment: paymentSchema_1.Payment,
    Wallet: walletSchema_1.Wallet,
    Issue: issueSchema_1.Issue,
    Notification: notificationSchema_1.Notification
};
exports.default = databaseSchema;
