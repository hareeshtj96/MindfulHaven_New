import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (requestData: {page: number, limit: number}) => {
        try {
            const {page, limit} = requestData;
            const response = await userRepository.getIndividualTherapist(page, limit);

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_INDIVIDUAL_THERAPIST_USECASE };
        }
    }
    return {executeFunction}
}