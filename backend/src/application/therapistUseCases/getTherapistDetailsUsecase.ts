import dependencies from "../../frameworks/config/dependencies";
import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    const executeFunction = async (therapistId: any) => {
        console.log("therapist id in use case:", therapistId)
        try {
            const response = await therapistRepository.getDetails(therapistId);
            console.log("Response from use case:", response);

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