import { userRepository, adminRepository } from "../repository";
import { userRegistration, userRegistrationGoogle, userLoginGoogle, userLogin, forgotPassword } from "../../application/UseCases";

import { adminLogin } from "../../application/adminUseCases";

const useCase: any={
    userRegistration: userRegistration,
    userRegistrationGoogle:userRegistrationGoogle,
    userLoginGoogle:userLoginGoogle,
    userLogin: userLogin,
    forgotPassword: forgotPassword,

    adminLogin:adminLogin
}

const repository:any={
    userRepository,
    adminRepository
}


export default{
    useCase,
    repository
}
