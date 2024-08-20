import { userRepository } from "../repository";
import { userRegistration } from "../../application/UseCases";

const useCase: any={
    userRegistration: userRegistration,
}

const repository:any={
    userRepository,
}


export default{
    useCase,
    repository
}
