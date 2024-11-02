"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminLoginController_1 = __importDefault(require("./adminLoginController"));
const adminGetTherapist_1 = __importDefault(require("./adminGetTherapist"));
const adminGetUsers_1 = __importDefault(require("./adminGetUsers"));
const adminTherapistVerification_1 = __importDefault(require("./adminTherapistVerification"));
const adminUserBlock_1 = __importDefault(require("./adminUserBlock"));
const getTherapistDetails_1 = __importDefault(require("./getTherapistDetails"));
const adminDashboardDetails_1 = __importDefault(require("./adminDashboardDetails"));
const adminFetchIssues_1 = __importDefault(require("./adminFetchIssues"));
const adminIssueResolve_1 = __importDefault(require("./adminIssueResolve"));
exports.default = (dependencies) => {
    return {
        adminLoginController: (0, adminLoginController_1.default)(dependencies),
        adminGetTherapist: (0, adminGetTherapist_1.default)(dependencies),
        adminGetUsers: (0, adminGetUsers_1.default)(dependencies),
        adminTherapistVerification: (0, adminTherapistVerification_1.default)(dependencies),
        adminUserBlock: (0, adminUserBlock_1.default)(dependencies),
        getTherapistDetails: (0, getTherapistDetails_1.default)(dependencies),
        adminDashboardDetails: (0, adminDashboardDetails_1.default)(dependencies),
        adminFetchIssues: (0, adminFetchIssues_1.default)(dependencies),
        adminIssueResolve: (0, adminIssueResolve_1.default)(dependencies),
    };
};
