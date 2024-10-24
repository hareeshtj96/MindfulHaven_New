import dependencies from "../../frameworks/config/dependencies";
import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    interface TimingsParams {
        email: string;
        startTime: string;
        endTime: string;
        date: string;
    }

    const executeFunction = async ({email, startTime, endTime, date}: TimingsParams) => {
        console.log("entered update therpist timings use case....");


        try {
            console.log("Recieved in use case:", email, startTime, endTime, date);

            const response = await therapistRepository.updateTimings(email, startTime, endTime, date);

            console.log("response from update use case:", response);

            if (response.status) {
                return { status: true, data: response.data}
            } else {
                return { status: false, message: response.message};
            }
        } catch (error) {
            console.error("Error in update therapist timings use case:", error);
            return { status: false, message: ResponseMessages.ERROR_UPDATING_THERAPIST_TIMINGS }
        }
        
    }
    return { executeFunction }
}