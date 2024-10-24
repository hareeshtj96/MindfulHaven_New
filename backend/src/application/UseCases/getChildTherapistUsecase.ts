import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (requestData: {page: number, limit: number}) => {
        console.log("entered use case:.....")
        try {
            const {page, limit} = requestData;
            const response = await userRepository.getChildTherapist(page, limit);

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: ResponseMessages.ERROR_IN_CHILD_THERAPIST_USECASE };
        }
    }
    return {executeFunction}
}