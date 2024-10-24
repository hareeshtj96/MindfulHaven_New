import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (requestData: { email: string}) => {
        console.log("entered use case:.....")
        try {
            const response = await userRepository.getUserProfile(requestData.email);
           
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: ResponseMessages.ERROR_IN_THERAPIST_USECASE };
        }
    }
    return {executeFunction}
}