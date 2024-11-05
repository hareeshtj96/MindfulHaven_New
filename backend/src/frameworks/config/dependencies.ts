import { userRepository, adminRepository, therapistRepository } from "../repository";
import { 
    userRegistration, 
    userRegistrationGoogle, 
    userLoginGoogle, 
    userLogin, 
    forgotPassword, 
    resetPassword, 
    getUserProfileUsecase,
    getChildTherapistUsecase, 
    getSlotsUsecase, 
    getAppointmentUsecase, 
    bookingDetailstUsecase,
    getAllBookings,
    getCompletedBookings,
    getCancelledBookings,
    getBookedSlotsUsecase,
    searchTherapistUsecase,
    sortChildTherapistUsecase,
    getPaymentUsecase,
    savePaymentUsecase,
    joinVideoSessionUsecase,
    searchChildTherapistUsecase,
    cancelAppointmentUsecase,
    geminiAPIUsecase,
    changePasswordUsecase,
    walletDetailsUsecase,
    submitIssueUsecase
 } from "../../application/UseCases";

import { adminLogin, getAllUsecase, getUsersUsecase, getVerifiedUsecase, getuserBlockUsecase, therapistDetailstUsecase, adminDashboardDetailsUsecase, getIssuesUsecase, getIssuesresolvedUsecase } from "../../application/adminUseCases";

import { therapistRegistration, getTherapistProfileUsecase, bookingUsecase, updateTherapistTimingsUsecase, therapistSessionUsecase, cancelAppointmentTherapistUsecase, getTherapistDetailsUsecase, therapistPhotoUsecase } from "../../application/therapistUseCases";

const useCase: any={
    userRegistration: userRegistration,
    userRegistrationGoogle:userRegistrationGoogle,
    userLoginGoogle:userLoginGoogle,
    userLogin: userLogin,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    getUserProfileUsecase:getUserProfileUsecase,
    getChildTherapistUsecase:getChildTherapistUsecase,
    getSlotsUsecase: getSlotsUsecase,
    getAppointmentUsecase: getAppointmentUsecase,
    bookingDetailstUsecase: bookingDetailstUsecase,
    getAllBookings: getAllBookings,
    getCompletedBookings: getCompletedBookings,
    getCancelledBookings: getCancelledBookings,
    getBookedSlotsUsecase: getBookedSlotsUsecase,
    searchTherapistUsecase: searchTherapistUsecase,
    sortChildTherapistUsecase: sortChildTherapistUsecase,
    getPaymentUsecase: getPaymentUsecase,
    savePaymentUsecase: savePaymentUsecase,
    joinVideoSessionUsecase: joinVideoSessionUsecase,
    searchChildTherapistUsecase: searchChildTherapistUsecase,
    cancelAppointmentUsecase: cancelAppointmentUsecase,
    geminiAPIUsecase: geminiAPIUsecase,
    changePasswordUsecase: changePasswordUsecase,
    walletDetailsUsecase: walletDetailsUsecase,
    submitIssueUsecase: submitIssueUsecase,



    

    adminLogin: adminLogin,
    getAllUsecase:getAllUsecase,
    getUsersUsecase: getUsersUsecase,
    getVerifiedUsecase: getVerifiedUsecase,
    getuserBlockUsecase: getuserBlockUsecase,
    therapistDetailstUsecase: therapistDetailstUsecase,
    adminDashboardDetailsUsecase: adminDashboardDetailsUsecase,
    getIssuesUsecase: getIssuesUsecase,
    getIssuesresolvedUsecase: getIssuesresolvedUsecase,
    




    therapistRegistration: therapistRegistration,
    getTherapistProfileUsecase: getTherapistProfileUsecase,
    bookingUsecase: bookingUsecase,
    updateTherapistTimingsUsecase: updateTherapistTimingsUsecase,
    therapistSessionUsecase: therapistSessionUsecase,
    cancelAppointmentTherapistUsecase: cancelAppointmentTherapistUsecase,
    getTherapistDetailsUsecase: getTherapistDetailsUsecase,
    therapistPhotoUsecase: therapistPhotoUsecase
}

const repository:any={
    userRepository,
    adminRepository,
    therapistRepository
}


export default{
    useCase,
    repository
}
