"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../../controller");
const roleMiddleware_1 = __importDefault(require("../../../middleware/roleMiddleware"));
exports.default = (dependencies) => {
    const router = (0, express_1.default)();
    const { adminLoginController, adminGetTherapist, adminGetUsers, adminTherapistVerification, adminUserBlock, getTherapistDetails, adminDashboardDetails, adminFetchIssues, adminIssueResolve } = (0, controller_1.adminController)(dependencies);
    router.post('/admin_login', adminLoginController);
    router.get('/admin_getTherapist', adminGetTherapist);
    router.get('/admin_getUsers', adminGetUsers);
    router.patch('/therapist_getVerified/:id', adminTherapistVerification);
    router.patch('/user_blockUnblock/:id', adminUserBlock);
    router.get('/admin_getTherapistDetails/:id', getTherapistDetails);
    router.get('/admin_dashboard', adminDashboardDetails);
    router.get('/admin_issues', adminFetchIssues);
    router.post('/admin_resolveIssues', adminIssueResolve);
    router.use('/*', (0, roleMiddleware_1.default)(['admin']));
    return router;
};
