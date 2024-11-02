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
const database_1 = require("../database");
const mongoose = require('mongoose');
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    createtherapist: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password, role } = data;
            let hashedPassword = null;
            if (password) {
                hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            }
            const therapist = new database_1.databaseSchema.Therapist({
                name,
                email,
                password: hashedPassword,
                role,
                isVerified: false
            });
            const response = yield therapist.save();
            if (response) {
                return { status: true, data: response };
            }
            else {
                return { status: false, message: "therapist creation failed" };
            }
        }
        catch (error) {
            return { status: false, message: "Internal server error" };
        }
    }),
    getTherapistByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const therapist = yield database_1.databaseSchema.Therapist.findOne({ email });
            if (therapist) {
                return { status: true, user: therapist };
            }
            else {
                return { status: false, message: 'Therapist not found' };
            }
        }
        catch (error) {
            return { status: false };
        }
    }),
    saveTherapist: (therapistData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingTherapist = yield database_1.databaseSchema.Therapist.findById(therapistData.therapistId);
            // If therapist exists, update the therapist
            if (existingTherapist) {
                const updatedTherapist = yield database_1.databaseSchema.Therapist.findByIdAndUpdate(therapistData.therapistId, {
                    name: therapistData.name,
                    phone: therapistData.phone,
                    specialization: therapistData.specialization,
                    gender: therapistData.gender,
                    educationalQualifications: therapistData.educationalQualifications,
                    identityProof: therapistData.identityProof,
                    counsellingQualification: therapistData.counsellingQualification,
                    professionalExperience: therapistData.professionalExperience,
                    establishment: therapistData.establishment,
                    location: therapistData.location,
                    timings: therapistData.timings,
                    fees: therapistData.fees,
                    photo: therapistData.photo,
                    availableSlots: therapistData.availableSlots,
                }, { new: true, runValidators: true });
                return { status: true, data: updatedTherapist };
            }
            delete therapistData.therapistId;
            const therapist = new database_1.databaseSchema.Therapist(therapistData);
            const savedTherapist = yield therapist.save();
            return { status: true, data: savedTherapist };
        }
        catch (error) {
            return { status: false, message: "Internal Server Error" };
        }
    }),
    getProfile: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const therapist = yield database_1.databaseSchema.Therapist.find();
            if (therapist) {
                return { status: true, data: { therapist } };
            }
            else {
                return { status: false, message: "Therapist profile not found" };
            }
        }
        catch (error) {
            return { status: false, message: "Error occured during getting therapist profile" };
        }
    }),
    getDetails: (therapistId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const therapistDetails = yield database_1.databaseSchema.Therapist.findById(therapistId);
            const availableSlots = therapistDetails === null || therapistDetails === void 0 ? void 0 : therapistDetails.availableSlots;
            const booked = therapistDetails === null || therapistDetails === void 0 ? void 0 : therapistDetails.booked;
            const timings = therapistDetails === null || therapistDetails === void 0 ? void 0 : therapistDetails.timings;
            return {
                status: true,
                data: {
                    availableSlots,
                    booked,
                    timings
                }
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Failed to fetch therapist details"
            };
        }
    }),
    getBookings: (therapistId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const totalBookingsCount = yield database_1.databaseSchema.Appointment.countDocuments({ therapistId });
            const totalPages = Math.ceil(totalBookingsCount / limit);
            const bookings = yield database_1.databaseSchema.Appointment.find({ therapistId }).skip((page - 1) * limit).limit(limit);
            if (!bookings) {
                return {
                    status: false, message: "Bookings not found"
                };
            }
            // query to get the userdetails 
            const bookingsWithUserDetails = yield Promise.all(bookings.map((booking) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield database_1.databaseSchema.User.findById(booking.userId).select('name email mobile');
                return Object.assign(Object.assign({}, booking.toObject()), { user: user ? { name: user.name, email: user.email, mobile: user.mobile } : 'Unknown user' });
            })));
            return {
                status: true, message: "Bookings retrieved successfully", data: bookingsWithUserDetails, totalPages
            };
        }
        catch (error) {
            return {
                status: false, message: "Error fetching bookings"
            };
        }
    }),
    updateTimings: (email, startTime, endTime, date) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const therapist = yield database_1.databaseSchema.Therapist.findOne({ email });
            if (!therapist) {
                return { status: false, message: "Therapist not found" };
            }
            const startDateTime = new Date(`${date} ${startTime}`);
            const endDateTime = new Date(`${date} ${endTime}`);
            const currentDateTime = new Date();
            if (startDateTime >= endDateTime) {
                return { status: false, message: "Start time must be before end time" };
            }
            if (startDateTime <= currentDateTime) {
                return { status: false, message: "Start time must be in the future" };
            }
            const newTiming = {
                date: new Date(date),
                startTime: startDateTime,
                endTime: endDateTime
            };
            therapist.updatedTimings.push(newTiming);
            yield therapist.save();
            return { status: true, data: therapist };
        }
        catch (error) {
            return { status: false, message: "Error occured during updatiing therapist timings" };
        }
    }),
    cancelAppointmentTherapist: (_a) => __awaiter(void 0, [_a], void 0, function* ({ bookingId }) {
        try {
            const appointment = yield database_1.databaseSchema.Appointment.findById(bookingId);
            if (!appointment) {
                return { status: false, message: "Appointment not found or invalid details" };
            }
            appointment.status = "cancelled";
            yield appointment.save();
            return { status: true, message: "Appointment cancelled successfuly" };
        }
        catch (error) {
            return { status: false, message: "Failed to cancel appointment" };
        }
    }),
    getCancelSlot: (_a) => __awaiter(void 0, [_a], void 0, function* ({ slotId, therapistId }) {
        try {
            const therapist = yield database_1.databaseSchema.Therapist.findById(therapistId);
            if (!therapist) {
                return { status: false, message: "Therapist not found" };
            }
            therapist.availableSlots.pull({ _id: slotId });
            yield therapist.save();
            return { status: true, message: "Slot removed successfully" };
        }
        catch (error) {
            return { status: false, message: "Failed to remove slot" };
        }
    })
};
