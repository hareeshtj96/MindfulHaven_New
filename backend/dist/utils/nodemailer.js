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
exports.sendIssueNotificationEmail = exports.sendVerificationEmail = exports.SendOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function generateOTP() {
    const numbers = '1234567890';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += numbers[Math.floor(Math.random() * numbers.length)];
    }
    return otp;
}
const SendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const otp = generateOTP();
        const info = yield transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP',
            text: `You OTP is: ${otp}`,
            html: `<p>Your OTP is: <b>${otp}</b></p>`,
        });
        if (info.accepted.length > 0) {
            return { status: true, otp };
        }
        else {
            return { status: false, message: 'Failed to send OTP' };
        }
    }
    catch (error) {
        console.error('Error sending otp:', error);
        return { status: false, message: 'internal server error' };
    }
});
exports.SendOtp = SendOtp;
const sendVerificationEmail = (email, therapistName, isVerified) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const subject = isVerified ? 'Verification Successful' : 'Verification Revoked';
        const message = isVerified
            ? `Dear ${therapistName}, your account has been successfully verified.`
            : `Dear ${therapistName}, your account verification has been failed. Please provide more information.`;
        const info = yield transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`
        });
        if (info.accepted.length > 0) {
            return { status: true };
        }
        else {
            return { status: false, message: 'Failed to send email' };
        }
    }
    catch (error) {
        console.error(`Error sendinf email:`, error);
        return { status: false, message: 'internal Server Error' };
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendIssueNotificationEmail = (therapistEmail, therapistName, issueDescription, userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const subject = `Issue Raised by User: ${userName}`;
        const message = `
            <p>Dear ${therapistName},</p>
            <p>A user has raised an issue regarding your session:</p>
            <p><strong>User Name:</strong> ${userName}</p>
            <p><strong>Issue Description:</strong> ${issueDescription}</p>
            <p>Please address this issue as soon as possible.</p>
        `;
        const info = yield transporter.sendMail({
            from: process.env.EMAIL,
            to: therapistEmail,
            subject: subject,
            text: `A user (${userName}) has raised an issue: ${issueDescription}`,
            html: message,
        });
        if (info.accepted.length > 0) {
            return { status: true };
        }
        else {
            return { status: false, message: 'Failed to send Email' };
        }
    }
    catch (error) {
        console.error(`Error sending email:`, error);
        return { status: false, message: 'Internal Server Error' };
    }
});
exports.sendIssueNotificationEmail = sendIssueNotificationEmail;
