import { userRepository, adminRepository, therapistRepository } from "../repository";
import { 
    userRegistration, 
    userRegistrationGoogle, 
    userLoginGoogle, 
    userLogin, 
    forgotPassword, 
    resetPassword, 
    getUserProfileUsecase,
    getChildTherapistUsecase } from "../../application/UseCases";

import { adminLogin, getAllUsecase, getUsersUsecase, getVerifiedUsecase } from "../../application/adminUseCases";

import { therapistRegistration, getTherapistProfileUsecase } from "../../application/therapistUseCases";

const useCase: any={
    userRegistration: userRegistration,
    userRegistrationGoogle:userRegistrationGoogle,
    userLoginGoogle:userLoginGoogle,
    userLogin: userLogin,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    getUserProfileUsecase:getUserProfileUsecase,
    getChildTherapistUsecase:getChildTherapistUsecase,

    

    adminLogin: adminLogin,
    getAllUsecase:getAllUsecase,
    getUsersUsecase: getUsersUsecase,
    getVerifiedUsecase: getVerifiedUsecase,
    


    therapistRegistration: therapistRegistration,
    getTherapistProfileUsecase: getTherapistProfileUsecase
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
