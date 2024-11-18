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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.default = {
    createUser: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password, mobile, role } = data;
            let hashedPassword = null;
            if (password) {
                hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            }
            else {
                return { status: false, message: "Password is required" };
            }
            const user = new database_1.databaseSchema.User({
                name,
                email,
                password: hashedPassword,
                mobile,
                role,
                isVerified: true,
            });
            const savedUser = yield user.save();
            //creating wallet for user
            const newWallet = new database_1.databaseSchema.Wallet({
                userId: savedUser._id,
                balance: 0,
                transactionHistory: [],
                currency: "INR",
            });
            // saving wallet
            const savedWallet = yield newWallet.save();
            // update user with the wallet reference
            savedUser.wallet = savedWallet._id;
            yield savedUser.save();
            const userWithWallet = yield database_1.databaseSchema.User.findById(savedUser._id).populate("wallet");
            return {
                status: true,
                data: { user: userWithWallet, wallet: savedWallet },
            };
        }
        catch (error) {
            return { status: false, message: "Internal server error" };
        }
    }),
    getUserByEmail: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = data;
            const user = yield database_1.databaseSchema.User.findOne({ email });
            if (user) {
                return { status: true, data: user };
            }
            else {
                return { status: false, message: "User not found" };
            }
        }
        catch (error) {
            throw new Error("Internal Server Error");
        }
    }),
    updateUserPassword: (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, hashedPassword, }) {
        try {
            const updatedUser = yield database_1.databaseSchema.User.findOneAndUpdate({ email }, { password: hashedPassword });
            if (updatedUser) {
                return { status: true, data: "password updated successfully" };
            }
            else {
                return { status: false, message: "User not found or update failed" };
            }
        }
        catch (error) {
            throw new Error("Internal Server Error");
        }
    }),
    changePassword: (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, currentPassword, newPassword, confirmPassword, }) {
        try {
            const user = yield database_1.databaseSchema.User.findOne({ email });
            if (!user) {
                return { status: false, message: "User not found" };
            }
            if (user && user.password) {
                // comparing current password with hashed password in the database
                const isPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
                if (!isPasswordValid) {
                    return { status: false, message: "Current password is incorrect" };
                }
            }
            if (newPassword !== confirmPassword) {
                return {
                    status: false,
                    message: "New password and confim password do not match",
                };
            }
            const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            const updatedUser = yield database_1.databaseSchema.User.findOneAndUpdate({ email }, { password: hashedNewPassword }, { new: true });
            if (updatedUser) {
                return { status: true, message: "Password updated successfully" };
            }
            else {
                return { status: false, message: "Failed to update password" };
            }
        }
        catch (error) {
            return {
                status: false,
                message: "Error occured while changing password",
            };
        }
    }),
    getUserProfile: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield database_1.databaseSchema.User.findOne({ email });
            if (user) {
                return { status: true, data: { user } };
            }
            else {
                return { status: false, message: "User profile not found" };
            }
        }
        catch (error) {
            return {
                status: false,
                message: "Error occured during getting user profile",
            };
        }
    }),
    getChildTherapist: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const skip = (page - 1) * limit;
            const therapists = yield database_1.databaseSchema.Therapist.find({
                specialization: "Child Therapy",
                isVerified: true,
            })
                .skip(skip)
                .limit(limit);
            const totalTherapists = yield database_1.databaseSchema.Therapist.countDocuments({
                specialization: "Child Therapy",
                isVerified: true,
            });
            return {
                status: true,
                data: {
                    therapists,
                    total: totalTherapists,
                    currentPage: page,
                    totalPages: Math.ceil(totalTherapists / limit),
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Error fetching child therapists",
            };
        }
    }),
    getFamilyTherapist: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const skip = (page - 1) * limit;
            const familyTherapist = yield database_1.databaseSchema.Therapist.find({
                specialization: "Family Therapy",
                isVerified: true,
            })
                .skip(skip)
                .limit(limit);
            const totalTherapists = yield database_1.databaseSchema.Therapist.countDocuments({
                specialization: "Family Therapy",
                isVerified: true,
            });
            return {
                status: true,
                data: {
                    familyTherapist,
                    total: totalTherapists,
                    currentPagesFamily: page,
                    totalPagesFamily: Math.ceil(totalTherapists / limit),
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Error fetching Family therapists",
            };
        }
    }),
    getIndividualTherapist: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const skip = (page - 1) * limit;
            const individualTherapists = yield database_1.databaseSchema.Therapist.find({
                specialization: "Individual Therapy",
                isVerified: true,
            })
                .skip(skip)
                .limit(limit);
            const totalTherapists = yield database_1.databaseSchema.Therapist.countDocuments({
                specialization: "Individual Therapy",
                isVerified: true,
            });
            return {
                status: true,
                data: {
                    individualTherapists,
                    total: totalTherapists,
                    currentPagesIndividual: page,
                    totalPagesIndividual: Math.ceil(totalTherapists / limit),
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Error fetching Individual therapists",
            };
        }
    }),
    getCoupleTherapist: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const skip = (page - 1) * limit;
            const coupleTherapists = yield database_1.databaseSchema.Therapist.find({
                specialization: "Couple Therapy",
                isVerified: true,
            })
                .skip(skip)
                .limit(limit);
            const totalTherapists = yield database_1.databaseSchema.Therapist.countDocuments({
                specialization: "Couple Therapy",
                isVerified: true,
            });
            return {
                status: true,
                data: {
                    coupleTherapists,
                    total: totalTherapists,
                    currentPagesCouple: page,
                    totalPagesCouple: Math.ceil(totalTherapists / limit),
                },
            };
        }
        catch (error) {
            return { status: false, message: "Error fetching Couple therapists" };
        }
    }),
    getTherapistDetails: (therapistId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const therapists = yield database_1.databaseSchema.Therapist.findOne({
                _id: therapistId,
                isVerified: true,
            });
            return {
                status: true,
                data: therapists,
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Error fetching therapists",
            };
        }
    }),
    getSlot: (therapistId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const therapist = yield database_1.databaseSchema.Therapist.findOne({
                _id: therapistId,
                isVerified: true,
            });
            if (!therapist) {
                return {
                    status: false,
                    mesage: "Therapist not found or not verified",
                };
            }
            // Destructure the required properties
            const { timings, availableSlots, booked } = therapist;
            // Fetch issues related to this therapist, where the rating exists
            const issues = yield database_1.databaseSchema.Issue.find({
                therapistId: therapistId,
                rating: { $exists: true, $ne: null },
            });
            // Fetch user details for each issue (User collection)
            const issuesWithUserDetails = yield Promise.all(issues.map((issue) => __awaiter(void 0, void 0, void 0, function* () {
                const issueObj = issue.toObject();
                const user = yield database_1.databaseSchema.User.findById(issueObj.userId);
                if (user) {
                    // Add user details to the issue object
                    issueObj.userName = user.name;
                    issueObj.userEmail = user.email;
                }
                return issueObj;
            })));
            return {
                status: true,
                data: {
                    timings,
                    availableSlots,
                    booked,
                    issues: issuesWithUserDetails
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Error fetching therapist slots",
            };
        }
    }),
    getBookedSlot: (therapistId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookedSlots = yield database_1.databaseSchema.Appointment.find({
                therapistId,
            });
            if (!bookedSlots) {
                return {
                    status: false,
                    message: "booked slot not found",
                };
            }
            const slots = bookedSlots.map((appointment) => {
                return appointment.slot;
            });
            return {
                status: true,
                message: "Booked slots retrieved successfully",
                data: slots,
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Error fetching booked slots",
            };
        }
    }),
    checkSlotBeforePayment: (therapistId, slotDate, slotTime) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookedSlots = yield database_1.databaseSchema.Appointment.find({
                therapistId,
                status: "scheduled",
            });
            const validAppointments = bookedSlots.filter((appointment) => {
                var _a;
                if (((_a = appointment.payment) === null || _a === void 0 ? void 0 : _a.paymentStatus) === "success") {
                    return true;
                }
                else {
                    appointment.status = "cancelled";
                    appointment.save();
                    return false;
                }
            });
            const isSlotBooked = validAppointments.some((appointment) => {
                const appointmentDate = appointment.slot.toISOString().split("T")[0];
                const appointmentTime = new Date(appointment.slot)
                    .toISOString()
                    .split("T")[1]
                    .slice(0, 5);
                return appointmentDate === slotDate && appointmentTime === slotTime;
                ``;
            });
            if (isSlotBooked) {
                return { status: false, message: "Slot is already booked" };
            }
            else {
                return { status: true, message: "Slot is available" };
            }
        }
        catch (error) {
            console.error("Error checking slot availability:", error);
            return { status: false, message: "Error fetching appointments" };
        }
    }),
    saveAppointment: (_a) => __awaiter(void 0, [_a], void 0, function* ({ therapistId, userId, slot, notes, paymentId, }) {
        try {
            const slotDate = typeof slot === "string" ? new Date(slot) : slot;
            // Check if the slot is already booked
            const existingAppointment = yield database_1.databaseSchema.Appointment.findOne({
                therapistId,
                slot: slotDate,
                status: { $ne: "cancelled" },
            });
            if (existingAppointment && typeof paymentId === "undefined") {
                return {
                    status: false,
                    message: "The slot is already booked. Please choose a different slot",
                };
            }
            let paymentDetails;
            if (paymentId) {
                // Fetch payment details if paymentId is provided
                paymentDetails = yield database_1.databaseSchema.Payment.findById(paymentId);
                if (!paymentDetails) {
                    return {
                        status: false,
                        message: "Payment details not found.",
                    };
                }
            }
            // Create the appointment object
            const appointmentData = {
                therapistId,
                userId,
                slot: slotDate,
                notes,
            };
            // Add payment details only if available
            if (paymentDetails) {
                appointmentData.payment = {
                    userId: paymentDetails.userId,
                    therapistId: paymentDetails.therapistId,
                    amount: paymentDetails.amount,
                    convenienceFee: paymentDetails.convenienceFee,
                    totalAmount: paymentDetails.totalAmount,
                    paymentMethod: paymentDetails.paymentMethod,
                    paymentStatus: paymentDetails.paymentStatus,
                    paymentDate: paymentDetails.paymentDate,
                    refundRequest: paymentDetails.refundRequest,
                    refundReason: paymentDetails.refundReason,
                    refundProcessedAt: paymentDetails.refundProcessedAt,
                };
            }
            // Save the appointment
            const newAppointment = new database_1.databaseSchema.Appointment(appointmentData);
            const savedAppointment = yield newAppointment.save();
            // Update the therapist's booked slots
            const therapist = yield database_1.databaseSchema.Therapist.findById(therapistId);
            if (therapist) {
                const bookedSlot = {
                    date: slotDate.toISOString().split("T")[0],
                    time: `${slotDate.getUTCHours() % 12 || 12}:00 ${slotDate.getUTCHours() >= 12 ? "PM" : "AM"}`,
                    status: true,
                };
                therapist.booked.push(bookedSlot);
                yield therapist.save();
            }
            return {
                status: true,
                data: savedAppointment,
            };
        }
        catch (error) {
            console.error("Error saving appointment:", error);
            return {
                status: false,
                message: "Failed to save the appointment",
            };
        }
    }),
    WalletPaymentSave: (_a) => __awaiter(void 0, [_a], void 0, function* ({ therapistId, userId, slot, notes, totalAmount, }) {
        try {
            console.log("Initiating wallet payment save...");
            console.log("total amount...", totalAmount);
            // Convert `slot` to a `Date` object if it's a string
            const slotDate = typeof slot === "string" ? new Date(slot) : slot;
            // Check if the slot is already booked
            const existingAppointment = yield database_1.databaseSchema.Appointment.findOne({
                therapistId,
                slot: slotDate,
                status: { $ne: "cancelled" },
            });
            if (existingAppointment) {
                return {
                    status: false,
                    message: "The slot is already booked. Please choose a different slot.",
                };
            }
            //Fetching user wallet
            const userWallet = yield database_1.databaseSchema.Wallet.findOne({ userId });
            if (!userWallet) {
                return { status: false, message: "user wallet not found" };
            }
            // check if wallet balance if sufficient
            let amount = totalAmount - 80;
            if (userWallet.balance < totalAmount) {
                return { status: false, message: "Insufficient wallet balance" };
            }
            // Create wallet payment details
            const walletPaymentDetails = {
                userId,
                therapistId,
                amount: amount,
                totalAmount: totalAmount,
                paymentMethod: "wallet",
                paymentStatus: "success",
                paymentDate: new Date(),
            };
            // Save payment details in the Payment collection
            const walletPayment = new database_1.databaseSchema.Payment(walletPaymentDetails);
            console.log(" wallet payment:", walletPayment);
            const savedWalletPayment = yield walletPayment.save();
            console.log("Saved wallet payment:", savedWalletPayment);
            // Create the appointment object
            const appointmentData = {
                therapistId,
                userId,
                slot: slotDate,
                notes,
                payment: {
                    userId: savedWalletPayment.userId,
                    therapistId: savedWalletPayment.therapistId,
                    amount: savedWalletPayment.amount,
                    totalAmount: savedWalletPayment.totalAmount,
                    paymentMethod: savedWalletPayment.paymentMethod,
                    paymentStatus: savedWalletPayment.paymentStatus,
                    paymentDate: savedWalletPayment.paymentDate,
                },
            };
            // Save the appointment
            const newAppointment = new database_1.databaseSchema.Appointment(appointmentData);
            const savedAppointment = yield newAppointment.save();
            // Update therapist's booked slots
            const therapist = yield database_1.databaseSchema.Therapist.findById(therapistId);
            if (therapist) {
                const bookedSlot = {
                    date: slotDate.toISOString().split("T")[0],
                    time: `${slotDate.getUTCHours() % 12 || 12}:00 ${slotDate.getUTCHours() >= 12 ? "PM" : "AM"}`,
                    status: true,
                };
                therapist.booked.push(bookedSlot);
                yield therapist.save();
            }
            // updating user's wallet
            userWallet.balance -= totalAmount;
            yield userWallet.save();
            return {
                status: true,
                data: savedAppointment,
            };
        }
        catch (error) {
            console.error("Error in WalletPaymentSave:", error);
            return {
                status: false,
                message: "Failed to process the wallet payment and save the appointment.",
            };
        }
    }),
    bookingDetails: (_a) => __awaiter(void 0, [_a], void 0, function* ({ bookingId }) {
        try {
            const response = yield database_1.databaseSchema.Appointment.findById(bookingId);
            return response;
        }
        catch (error) {
            return { status: false, message: "Failed to find booking details" };
        }
    }),
    cancelAppointment: (_a) => __awaiter(void 0, [_a], void 0, function* ({ bookingId, userId, }) {
        var _b;
        try {
            const appointment = yield database_1.databaseSchema.Appointment.findById(bookingId);
            if (!appointment) {
                return {
                    status: false,
                    message: "Appointment not found or invalid details",
                };
            }
            if (appointment.status === "cancelled") {
                return { status: false, message: "Appointment already cancelled" };
            }
            appointment.status = "cancelled";
            yield appointment.save();
            const userWallet = yield database_1.databaseSchema.Wallet.findOne({ userId });
            if (!userWallet) {
                return { status: false, message: "user wallet not found" };
            }
            const refundAmount = (_b = appointment.payment) === null || _b === void 0 ? void 0 : _b.amount;
            if (!refundAmount) {
                return { status: false, message: "Refund amount not found" };
            }
            userWallet.balance += refundAmount;
            userWallet.transactionHistory.push({
                type: "refund",
                amount: refundAmount,
                date: new Date(),
            });
            yield userWallet.save();
            return {
                status: true,
                message: "Appointment cancelled successfuly and amount refunded successfully",
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Failed to cancel appointment and refund amount",
            };
        }
    }),
    getAllBooking: (userId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const skip = (page - 1) * limit;
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const bookings = yield database_1.databaseSchema.Appointment.find({
                userId: userId,
                status: "scheduled",
                slot: { $gte: currentDate },
            })
                .skip(skip)
                .limit(limit);
            // Fetch therapist details for each booking
            const bookingWithTherapists = yield Promise.all(bookings.map((booking) => __awaiter(void 0, void 0, void 0, function* () {
                const therapistDetails = yield database_1.databaseSchema.Therapist.findById(booking.therapistId);
                return Object.assign(Object.assign({}, booking._doc), { therapist: therapistDetails });
            })));
            const totalBookings = yield database_1.databaseSchema.Appointment.countDocuments({
                userId: userId,
                status: "scheduled",
                slot: { $gte: currentDate },
            });
            return {
                status: true,
                data: {
                    bookings: bookingWithTherapists,
                    total: totalBookings,
                    currentPage: page,
                    totalPages: Math.ceil(totalBookings / limit),
                },
            };
        }
        catch (error) {
            return { status: false, message: "Failed to find all booking details" };
        }
    }),
    getCompletedBooking: (userId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const skip = (page - 1) * limit;
            const bookings = yield database_1.databaseSchema.Appointment.find({
                userId: userId,
                status: "completed",
            })
                .skip(skip)
                .limit(limit);
            // Fetch therapist details for each booking
            const bookingWithTherapists = yield Promise.all(bookings.map((booking) => __awaiter(void 0, void 0, void 0, function* () {
                const therapistDetails = yield database_1.databaseSchema.Therapist.findById(booking.therapistId);
                return Object.assign(Object.assign({}, booking._doc), { therapist: therapistDetails });
            })));
            const totalBookings = yield database_1.databaseSchema.Appointment.countDocuments({
                userId: userId,
                status: "completed",
            });
            return {
                status: true,
                data: {
                    bookings: bookingWithTherapists,
                    total: totalBookings,
                    currentPage: page,
                    totalPages: Math.ceil(totalBookings / limit),
                },
            };
        }
        catch (error) {
            return { status: false, message: "Failed to find all booking details" };
        }
    }),
    getCancelledBooking: (userId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const skip = (page - 1) * limit;
            const bookings = yield database_1.databaseSchema.Appointment.find({
                userId: userId,
                status: "cancelled",
            })
                .skip(skip)
                .limit(limit);
            // Fetch therapist details for each booking
            const bookingWithTherapists = yield Promise.all(bookings.map((booking) => __awaiter(void 0, void 0, void 0, function* () {
                const therapistDetails = yield database_1.databaseSchema.Therapist.findById(booking.therapistId);
                return Object.assign(Object.assign({}, booking._doc), { therapist: therapistDetails });
            })));
            const totalBookings = yield database_1.databaseSchema.Appointment.countDocuments({
                userId: userId,
                status: "cancelled",
            });
            return {
                status: true,
                data: {
                    bookings: bookingWithTherapists,
                    total: totalBookings,
                    currentPage: page,
                    totalPages: Math.ceil(totalBookings / limit),
                },
            };
        }
        catch (error) {
            return { status: false, message: "Failed to find all booking details" };
        }
    }),
    getSearchResult: (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { specialization: { $regex: searchTerm, $options: "i" } },
            ],
        };
        try {
            const therapists = yield database_1.databaseSchema.Therapist.find(filter);
            return therapists;
        }
        catch (error) {
            return { status: false, message: "Failed to fetch search results" };
        }
    }),
    getChildTherapistSearchResult: (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { specialization: { $regex: searchTerm, $options: "i" } },
            ],
        };
        try {
            const therapists = yield database_1.databaseSchema.Therapist.find(filter);
            return therapists;
        }
        catch (error) {
            return {
                status: false,
                message: "Failed to fetch search child therapists",
            };
        }
    }),
    getCoupleTherapistSearchResult: (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { specialization: { $regex: searchTerm, $options: "i" } },
            ],
        };
        try {
            const therapists = yield database_1.databaseSchema.Therapist.find(filter);
            return therapists;
        }
        catch (error) {
            return {
                status: false,
                message: "Failed to fetch search couple therapists",
            };
        }
    }),
    getFamilyTherapistSearchResult: (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { specialization: { $regex: searchTerm, $options: "i" } },
            ],
        };
        try {
            const therapists = yield database_1.databaseSchema.Therapist.find(filter);
            return therapists;
        }
        catch (error) {
            return {
                status: false,
                message: "Failed to fetch search family therapists",
            };
        }
    }),
    getIndividualTherapistSearchResult: (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { specialization: { $regex: searchTerm, $options: "i" } },
            ],
        };
        try {
            const therapists = yield database_1.databaseSchema.Therapist.find(filter);
            return therapists;
        }
        catch (error) {
            return {
                status: false,
                message: "Failed to fetch search individual therapists",
            };
        }
    }),
    getSortedTherapists: (_a) => __awaiter(void 0, [_a], void 0, function* ({ sortCriteria, page, limit }) {
        try {
            const skip = (page - 1) * limit;
            const sortedTherapists = yield database_1.databaseSchema.Therapist.find({
                specialization: "Child Therapy",
                isVerified: true,
            }).sort(sortCriteria).skip(skip).limit(limit).lean();
            const totalTherapist = yield database_1.databaseSchema.Therapist.countDocuments({
                specialization: "Child Therapy",
                isVerified: true,
            });
            return {
                status: true,
                data: {
                    sortedTherapists,
                    total: totalTherapist,
                    currentPage: page,
                    totalPages: Math.ceil(totalTherapist / limit)
                }
            };
        }
        catch (error) {
            return { status: false, message: "Error fetching sorted therapists" };
        }
    }),
    getSortedFamilyTherapists: (_a) => __awaiter(void 0, [_a], void 0, function* ({ sortCriteria, page, limit }) {
        try {
            const skip = (page - 1) * limit;
            const sortedFamilyTherapists = yield database_1.databaseSchema.Therapist.find({
                specialization: "Family Therapy",
                isVerified: true,
            }).sort(sortCriteria).skip(skip).limit(limit).lean();
            const totalTherapist = yield database_1.databaseSchema.Therapist.countDocuments({
                specialization: 'Family Therapy',
                isVerified: true,
            });
            return {
                status: true,
                data: {
                    sortedFamilyTherapists,
                    total: totalTherapist,
                    currentPageFamily: page,
                    totalPagesFamily: Math.ceil(totalTherapist / limit)
                }
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Error fetching sorted family therapists",
            };
        }
    }),
    getSortedIndividualTherapists: (_a) => __awaiter(void 0, [_a], void 0, function* ({ sortCriteria, page, limit }) {
        try {
            const skip = (page - 1) * limit;
            const sortedIndividualTherapists = yield database_1.databaseSchema.Therapist.find({
                specialization: "Individual Therapy",
                isVerified: true,
            }).sort(sortCriteria).skip(skip).limit(limit).lean();
            const totalTherapist = yield database_1.databaseSchema.Therapist.countDocuments({
                specialization: 'Individual Therapy',
                isVerified: true,
            });
            return {
                status: true,
                data: {
                    sortedIndividualTherapists,
                    total: totalTherapist,
                    currentPagesIndividual: page,
                    totalPagesIndividual: Math.ceil(totalTherapist / limit)
                }
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Error fetching sorted individual therapists",
            };
        }
    }),
    getSortedCoupleTherapists: (_a) => __awaiter(void 0, [_a], void 0, function* ({ sortCriteria, page, limit }) {
        try {
            const skip = (page - 1) * limit;
            const sortedCoupleTherapists = yield database_1.databaseSchema.Therapist.find({
                specialization: "Couple Therapy",
                isVerified: true,
            }).sort(sortCriteria).skip(skip).limit(limit).lean();
            const totalTherapist = yield database_1.databaseSchema.Therapist.countDocuments({
                specialization: 'Couple Therapy',
                isVerified: true,
            });
            return {
                status: true,
                data: {
                    sortedCoupleTherapists,
                    total: totalTherapist,
                    currentPagesCouple: page,
                    totalPagesCouple: Math.ceil(totalTherapist / limit)
                }
            };
        }
        catch (error) {
            return {
                status: false,
                message: "Error fetching sorted couple therapists",
            };
        }
    }),
    savePayment: (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield database_1.databaseSchema.Payment.create(paymentData);
            return { status: true, data: result, paymentId: result._id };
        }
        catch (error) {
            return { status: false, message: "Failed to save payment" };
        }
    }),
    walletDetails: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        try {
            const result = yield database_1.databaseSchema.Wallet.findOne({ userId });
            if (!result) {
                return { status: false, message: "Wallet not found" };
            }
            return { status: true, data: result };
        }
        catch (error) {
            return { status: false, message: "Failed to retrieve wallet details" };
        }
    }),
    getSubmitIssue: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, bookingId, description, category, status, rating, }) {
        try {
            const booking = yield database_1.databaseSchema.Appointment.findById(bookingId);
            if (!booking) {
                return { status: false, message: "Booking not found" };
            }
            // Update the booking status to 'completed'
            booking.status = "completed";
            yield booking.save();
            const { therapistId } = booking;
            const newIssue = new database_1.databaseSchema.Issue({
                userId,
                bookingId,
                therapistId,
                description,
                category,
                rating,
                status,
            });
            const result = yield newIssue.save();
            return { status: true, data: result };
        }
        catch (error) {
            console.error("Error in saving submit issue:", error);
            return { status: false, message: "Failed to save issue" };
        }
    }),
};
