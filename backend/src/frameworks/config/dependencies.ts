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
    walletDetailsUsecase
 } from "../../application/UseCases";

import { adminLogin, getAllUsecase, getUsersUsecase, getVerifiedUsecase, getuserBlockUsecase, therapistDetailstUsecase } from "../../application/adminUseCases";

import { therapistRegistration, getTherapistProfileUsecase, bookingUsecase, updateTherapistTimingsUsecase, therapistSessionUsecase, cancelAppointmentTherapistUsecase } from "../../application/therapistUseCases";

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



    

    adminLogin: adminLogin,
    getAllUsecase:getAllUsecase,
    getUsersUsecase: getUsersUsecase,
    getVerifiedUsecase: getVerifiedUsecase,
    getuserBlockUsecase: getuserBlockUsecase,
    therapistDetailstUsecase: therapistDetailstUsecase,
    




    therapistRegistration: therapistRegistration,
    getTherapistProfileUsecase: getTherapistProfileUsecase,
    bookingUsecase: bookingUsecase,
    updateTherapistTimingsUsecase: updateTherapistTimingsUsecase,
    therapistSessionUsecase: therapistSessionUsecase,
    cancelAppointmentTherapistUsecase: cancelAppointmentTherapistUsecase
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
