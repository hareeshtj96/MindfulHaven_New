"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../repository");
const UseCases_1 = require("../../application/UseCases");
const adminUseCases_1 = require("../../application/adminUseCases");
const therapistUseCases_1 = require("../../application/therapistUseCases");
const useCase = {
    userRegistration: UseCases_1.userRegistration,
    userRegistrationGoogle: UseCases_1.userRegistrationGoogle,
    userLoginGoogle: UseCases_1.userLoginGoogle,
    userLogin: UseCases_1.userLogin,
    forgotPassword: UseCases_1.forgotPassword,
    resetPassword: UseCases_1.resetPassword,
    getUserProfileUsecase: UseCases_1.getUserProfileUsecase,
    getChildTherapistUsecase: UseCases_1.getChildTherapistUsecase,
    getSlotsUsecase: UseCases_1.getSlotsUsecase,
    getAppointmentUsecase: UseCases_1.getAppointmentUsecase,
    bookingDetailstUsecase: UseCases_1.bookingDetailstUsecase,
    getAllBookings: UseCases_1.getAllBookings,
    getCompletedBookings: UseCases_1.getCompletedBookings,
    getCancelledBookings: UseCases_1.getCancelledBookings,
    getBookedSlotsUsecase: UseCases_1.getBookedSlotsUsecase,
    searchTherapistUsecase: UseCases_1.searchTherapistUsecase,
    sortChildTherapistUsecase: UseCases_1.sortChildTherapistUsecase,
    getPaymentUsecase: UseCases_1.getPaymentUsecase,
    savePaymentUsecase: UseCases_1.savePaymentUsecase,
    joinVideoSessionUsecase: UseCases_1.joinVideoSessionUsecase,
    searchChildTherapistUsecase: UseCases_1.searchChildTherapistUsecase,
    cancelAppointmentUsecase: UseCases_1.cancelAppointmentUsecase,
    geminiAPIUsecase: UseCases_1.geminiAPIUsecase,
    changePasswordUsecase: UseCases_1.changePasswordUsecase,
    walletDetailsUsecase: UseCases_1.walletDetailsUsecase,
    submitIssueUsecase: UseCases_1.submitIssueUsecase,
    getFamilyTherapistUsecase: UseCases_1.getFamilyTherapistUsecase,
    searchFamilyTherapistUsecase: UseCases_1.searchFamilyTherapistUsecase,
    sortFamilyTherapistUsecase: UseCases_1.sortFamilyTherapistUsecase,
    getIndividualTherapistUsecase: UseCases_1.getIndividualTherapistUsecase,
    sortIndividualTherapistUsecase: UseCases_1.sortIndividualTherapistUsecase,
    searchIndividualTherapistUsecase: UseCases_1.searchIndividualTherapistUsecase,
    getCoupleTherapistUsecase: UseCases_1.getCoupleTherapistUsecase,
    sortCoupleTherapistUsecase: UseCases_1.sortCoupleTherapistUsecase,
    checkSlotBeforePaymentUsecase: UseCases_1.checkSlotBeforePaymentUsecase,
    adminLogin: adminUseCases_1.adminLogin,
    getAllUsecase: adminUseCases_1.getAllUsecase,
    getUsersUsecase: adminUseCases_1.getUsersUsecase,
    getVerifiedUsecase: adminUseCases_1.getVerifiedUsecase,
    getuserBlockUsecase: adminUseCases_1.getuserBlockUsecase,
    therapistDetailstUsecase: adminUseCases_1.therapistDetailstUsecase,
    adminDashboardDetailsUsecase: adminUseCases_1.adminDashboardDetailsUsecase,
    getIssuesUsecase: adminUseCases_1.getIssuesUsecase,
    getIssuesresolvedUsecase: adminUseCases_1.getIssuesresolvedUsecase,
    therapistRegistration: therapistUseCases_1.therapistRegistration,
    getTherapistProfileUsecase: therapistUseCases_1.getTherapistProfileUsecase,
    bookingUsecase: therapistUseCases_1.bookingUsecase,
    updateTherapistTimingsUsecase: therapistUseCases_1.updateTherapistTimingsUsecase,
    therapistSessionUsecase: therapistUseCases_1.therapistSessionUsecase,
    cancelAppointmentTherapistUsecase: therapistUseCases_1.cancelAppointmentTherapistUsecase,
    getTherapistDetailsUsecase: therapistUseCases_1.getTherapistDetailsUsecase,
    therapistPhotoUsecase: therapistUseCases_1.therapistPhotoUsecase,
    cancelSlotUsecase: therapistUseCases_1.cancelSlotUsecase,
};
const repository = {
    userRepository: repository_1.userRepository,
    adminRepository: repository_1.adminRepository,
    therapistRepository: repository_1.therapistRepository
};
exports.default = {
    useCase,
    repository
};
