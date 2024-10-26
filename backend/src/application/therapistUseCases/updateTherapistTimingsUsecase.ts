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
    
        try {
          
            const response = await therapistRepository.updateTimings(email, startTime, endTime, date);

            if (response.status) {
                return { status: true, data: response.data}
            } else {
                return { status: false, message: response.message};
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_UPDATING_THERAPIST_TIMINGS }
        }
        
    }
    return { executeFunction }
}