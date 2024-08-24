import { userRepository } from "../repository";
import { userRegistration } from "../../application/UseCases";
import { userRegistrationGoogle } from "../../application/UseCases";
import {userLoginGoogle} from "../../application/UseCases";
import { userLogin } from "../../application/UseCases";
import { forgotPassword } from "../../application/UseCases";

const useCase: any={
    userRegistration: userRegistration,
    userRegistrationGoogle:userRegistrationGoogle,
    userLoginGoogle:userLoginGoogle,
    userLogin: userLogin,
    forgotPassword: forgotPassword,
}

const repository:any={
    userRepository,
}


export default{
    useCase,
    repository
}
