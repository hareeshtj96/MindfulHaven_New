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
const moment_1 = __importDefault(require("moment"));
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
    uploadPhoto: (therapistId, photoUrl) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingTherapist = yield database_1.databaseSchema.Therapist.findById(therapistId);
            if (existingTherapist) {
                const updatedTherapist = yield database_1.databaseSchema.Therapist.findByIdAndUpdate(therapistId, { photo: photoUrl }, { new: true });
                return { status: true, data: updatedTherapist };
            }
            return { status: false, message: "Therapist not found" };
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
            const updatedTimings = therapistDetails === null || therapistDetails === void 0 ? void 0 : therapistDetails.updatedTimings;
            const timings = therapistDetails === null || therapistDetails === void 0 ? void 0 : therapistDetails.timings;
            const appointments = yield database_1.databaseSchema.Appointment.find({
                therapistId,
                'payment.paymentStatus': 'success'
            }).select('slot');
            const bookedSlots = appointments.map((appointment) => appointment.slot);
            return {
                status: true,
                data: {
                    updatedTimings,
                    booked: bookedSlots,
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
    getBookings: (therapistId, page, limit, status) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const filter = {
                therapistId,
                'payment.paymentStatus': 'success',
            };
            if (status) {
                if (status === 'upcoming') {
                    filter.status = 'scheduled';
                }
                else {
                    filter.status = status;
                }
            }
            const totalBookingsCount = yield database_1.databaseSchema.Appointment.countDocuments(filter).skip((page - 1) * limit).limit(limit);
            const totalPages = Math.ceil(totalBookingsCount / limit);
            const bookings = yield database_1.databaseSchema.Appointment.find(filter).skip((page - 1) * limit).limit(limit);
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
                status: true,
                message: "Bookings retrieved successfully",
                data: bookingsWithUserDetails,
                currentPagesBooking: page,
                totalPagesBooking: totalPages
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
            const reformattedDate = date.split("/").reverse().join("-");
            const [startHour, startMinute] = startTime.split(":").map(Number);
            const [endHour, endMinute] = endTime.split(":").map(Number);
            const startDateTime = new Date(reformattedDate);
            startDateTime.setHours(startHour, startMinute, 0);
            const endDateTime = new Date(reformattedDate);
            endDateTime.setHours(endHour, endMinute, 0);
            const currentDateTime = new Date();
            if (startDateTime >= endDateTime) {
                return { status: false, message: "Start time must be before end time" };
            }
            if (startDateTime <= currentDateTime) {
                return { status: false, message: "Start time must be in the future" };
            }
            // Find an existing entry for the same date
            const existingDateEntry = therapist.updatedTimings.find(timing => timing.date.toISOString().split("T")[0] === reformattedDate);
            if (existingDateEntry) {
                // Check for overlapping slots
                const isOverlapping = existingDateEntry.slots.some(slot => {
                    const existingStart = new Date(`${reformattedDate}T${slot.startTime}`);
                    const existingEnd = new Date(`${reformattedDate}T${slot.endTime}`);
                    return ((startDateTime >= existingStart && startDateTime < existingEnd) ||
                        (endDateTime > existingStart && endDateTime <= existingEnd) ||
                        (startDateTime <= existingStart && endDateTime >= existingEnd));
                });
                if (isOverlapping) {
                    return { status: false, message: "This timing overlaps with an existing slot" };
                }
                // Add the new slot to the existing date
                existingDateEntry.slots.push({ startTime, endTime });
            }
            else {
                // Create a new entry for this date
                therapist.updatedTimings.push({
                    date: new Date(reformattedDate),
                    slots: [{ startTime, endTime }]
                });
            }
            yield therapist.save();
            return { status: true, message: "Timings updated successfully" };
        }
        catch (error) {
            console.error("Error updating timings:", error);
            return { status: false, message: "Error occurred during updating therapist timings" };
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
            const { updatedTimings } = therapist;
            const timingIndex = updatedTimings.findIndex((timing) => timing.slots.some((slot) => { var _a; return ((_a = slot._id) === null || _a === void 0 ? void 0 : _a.toString()) === slotId; }));
            if (timingIndex === -1) {
                return { status: false, message: "Slot not found in updatedTimings" };
            }
            // Remove slot from slots array
            const slotIndex = updatedTimings[timingIndex].slots.findIndex((slot) => { var _a; return ((_a = slot._id) === null || _a === void 0 ? void 0 : _a.toString()) === slotId; });
            if (slotIndex !== -1) {
                updatedTimings[timingIndex].slots.splice(slotIndex, 1);
            }
            yield therapist.save();
            return { status: true, message: "Slot removed successfully" };
        }
        catch (error) {
            console.error("Error in removing slot:", error);
            return { status: false, message: "Failed to remove slot" };
        }
    }),
    getTherapistProfit: (_a) => __awaiter(void 0, [_a], void 0, function* ({ therapistId }) {
        try {
            console.log("therapist id in repo:", therapistId);
            const appointments = yield database_1.databaseSchema.Appointment.find({
                therapistId,
                status: 'scheduled',
            });
            const totalProfit = appointments.reduce((sum, appointment) => {
                var _a;
                return sum + (((_a = appointment.payment) === null || _a === void 0 ? void 0 : _a.amount) || 0);
            }, 0);
            console.log('total Profit', totalProfit);
            const timeSlotCounts = {};
            appointments.forEach((appointment) => {
                const hour = new Date(appointment.slot).getUTCHours(); // Extract the hour
                timeSlotCounts[hour] = (timeSlotCounts[hour] || 0) + 1;
            });
            const mostBookedHour = Object.entries(timeSlotCounts).reduce((max, [hour, count]) => (count > max.count ? { hour, count } : max), { hour: null, count: 0 }).hour;
            // Calculate user with the highest bookings
            const userBookingCounts = {};
            appointments.forEach((appointment) => {
                const userId = appointment.userId.toString();
                userBookingCounts[userId] = (userBookingCounts[userId] || 0) + 1;
            });
            const mostFrequentUser = Object.entries(userBookingCounts).reduce((max, [userId, count]) => (count > max.count ? { userId, count } : max), { userId: null, count: 0 }).userId;
            const user = yield database_1.databaseSchema.User.findById(mostFrequentUser);
            const userName = user === null || user === void 0 ? void 0 : user.name;
            return {
                status: true,
                totalProfit,
                mostBookedHour,
                userName,
            };
        }
        catch (error) {
            console.error("Error in get therapist profit:", error);
            return { status: false, message: "Failed to fetch profit" };
        }
    }),
    therapistNotifications: (_a) => __awaiter(void 0, [_a], void 0, function* ({ therapistId }) {
        try {
            const appointments = yield database_1.databaseSchema.Appointment.find({
                therapistId,
                status: 'scheduled',
                'payment.paymentStatus': 'success'
            });
            // Get today's date
            const today = (0, moment_1.default)().startOf('day');
            // Filter appointments matching today's date
            const todayAppointments = appointments.filter(appointment => (0, moment_1.default)(appointment.slot).isSame(today, 'day'));
            // For each appointment, fetch the therapist's name
            const appointmentsWithUser = yield Promise.all(todayAppointments.map((appointment) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield database_1.databaseSchema.User.findById(appointment.userId);
                return Object.assign(Object.assign({}, appointment.toObject()), { userName: user ? user.name : 'Unknown' });
            })));
            return {
                status: true,
                data: appointmentsWithUser
            };
        }
        catch (error) {
            console.error("Error fetching therapist notifications:", error);
            return {
                status: false,
                message: "Error fetching therapist notifications"
            };
        }
    }),
};
