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
const nodemailer_1 = require("../../utils/nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    getAdminByEmail: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const admin = yield database_1.databaseSchema.Admin.findOne({ email });
            if (admin) {
                if (admin.password === password) {
                    return { status: true, user: admin };
                }
                else {
                    return { status: false, message: 'Incorrect password' };
                }
            }
            else {
                return { status: false, message: 'Admin not found' };
            }
        }
        catch (error) {
            return { status: false };
        }
    }),
    getAllTherapists: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = data.page || 1;
            const limit = data.limit || 2;
            const skip = (page - 1) * limit;
            const therapists = yield database_1.databaseSchema.Therapist.find().skip(skip).limit(limit);
            const totalTherapist = yield database_1.databaseSchema.Therapist.countDocuments();
            const totalPages = Math.ceil(totalTherapist / limit);
            if (therapists && therapists.length > 0) {
                return {
                    status: true,
                    data: {
                        therapists,
                        total: totalTherapist,
                        currentPage: page,
                        totalPages: Math.ceil(totalTherapist / limit),
                    }
                };
            }
            else {
                return { status: false, message: "Therapists not found" };
            }
        }
        catch (error) {
            return { status: false, message: "Error occured during get Therapists" };
        }
    }),
    getAllUsers: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = data.page || 1;
            const limit = data.limit || 8;
            const skip = (page - 1) * limit;
            const users = yield database_1.databaseSchema.User.find().skip(skip).limit(limit);
            const totalUsers = yield database_1.databaseSchema.User.countDocuments();
            if (users && users.length > 0) {
                return {
                    status: true,
                    data: {
                        users,
                        total: totalUsers,
                        currentPage: page,
                        totalPages: Math.ceil(totalUsers / limit)
                    }
                };
            }
            else {
                return { status: false, message: "User not found" };
            }
        }
        catch (error) {
            return { status: false, message: "Error occured during get Therapists" };
        }
    }),
    getVerified: (therapistId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const therapist = yield database_1.databaseSchema.Therapist.findById(therapistId);
            if (!therapist) {
                return { status: false, message: "Therapist not found" };
            }
            const newVerifiefStatus = !therapist.isVerified;
            const updatedTherapist = yield database_1.databaseSchema.Therapist.findByIdAndUpdate(therapistId, { isVerified: newVerifiefStatus }, { new: true });
            if (updatedTherapist) {
                return { status: true, data: { therapist: updatedTherapist } };
            }
            else {
                return { status: false, message: "Therapist not found or verification failed" };
            }
        }
        catch (error) {
            return { status: false, message: "Error occured during therapist verification" };
        }
    }),
    getBlock: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield database_1.databaseSchema.User.findById(userId);
            if (!user) {
                return { status: false, message: "User not found" };
            }
            const newStatus = !user.isBlocked;
            const updatedUser = yield database_1.databaseSchema.User.findByIdAndUpdate(userId, { isBlocked: newStatus }, { new: true });
            if (updatedUser) {
                return { status: true, data: { user: updatedUser } };
            }
            else {
                return { status: false, message: "user not found" };
            }
        }
        catch (error) {
            return { status: false, message: "Error occured during user block unblock" };
        }
    }),
    therapistDetails: (therapistId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("therapist id in admin repostioy:", therapistId);
        try {
            const therapist = yield database_1.databaseSchema.Therapist.findById(therapistId);
            if (!therapist) {
                return { status: false, message: "Therapist not found" };
            }
            return { status: true, message: "Therapist fetched successfully", therapist };
        }
        catch (error) {
            return { status: false, message: "An error occurred while fetching the therapist details", error: error.message };
        }
    }),
    getAllIssues: () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("get all issues repository...");
        try {
            const issues = yield database_1.databaseSchema.Issue.find();
            const enrichedIssues = [];
            for (const issue of issues) {
                const issueObject = issue.toObject();
                const user = yield database_1.databaseSchema.User.findById(issue.userId).select('name');
                const therapist = yield database_1.databaseSchema.Therapist.findById(issue.therapistId).select('name');
                const enrichedIssue = Object.assign(Object.assign({}, issueObject), { userName: user ? user.name : "unknown user", therapistName: therapist ? therapist.name : "unknown Therapist" });
                enrichedIssues.push(enrichedIssue);
            }
            return { status: true, data: enrichedIssues };
        }
        catch (error) {
            return { status: false, message: "Error occured while fetching issues" };
        }
    }),
    dashboardDetails: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const totalUsers = yield database_1.databaseSchema.User.countDocuments();
            const totalTherapists = yield database_1.databaseSchema.Therapist.countDocuments();
            const totalAppointments = yield database_1.databaseSchema.Appointment.countDocuments();
            const totalRevenueData = yield database_1.databaseSchema.Payment.aggregate([
                {
                    $match: {
                        paymentStatus: "success",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$convenienceFee"
                        }
                    }
                }
            ]);
            const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].totalRevenue : 0;
            return {
                status: true,
                data: {
                    totalUsers,
                    totalTherapists,
                    totalAppointments,
                    totalRevenue
                }
            };
        }
        catch (error) {
            return { status: false, message: "Error fetching dashboard details" };
        }
    }),
    getIssueResolved: (issueId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const issue = yield database_1.databaseSchema.Issue.findById(issueId);
            if (!issue) {
                return { status: false, message: "Issue not found" };
            }
            const therapistId = issue.therapistId;
            const userId = issue.userId;
            if (issue.category === "therapist") {
                const therapist = yield database_1.databaseSchema.Therapist.findById(therapistId).select('email name');
                const user = yield database_1.databaseSchema.User.findById(userId).select('name');
                if (therapist && therapist.email && user) {
                    const therapistEmail = therapist.email;
                    const therapistName = therapist.name;
                    const userName = user.name;
                    const emailResponse = yield (0, nodemailer_1.sendIssueNotificationEmail)(therapistEmail, therapistName, issue.description, userName !== null && userName !== void 0 ? userName : 'user');
                    if (emailResponse.status) {
                        issue.status = "resolved";
                        yield issue.save();
                    }
                    else {
                        return { status: false, message: emailResponse.message };
                    }
                }
                else {
                    return { status: false, message: "Therapist email not found" };
                }
            }
            else {
                issue.status = "resolved";
                yield issue.save();
            }
            return { status: true, message: "Issue resolved successfully" };
        }
        catch (error) {
            return { status: false, message: "Failed to resolve the issue" };
        }
    }),
};
