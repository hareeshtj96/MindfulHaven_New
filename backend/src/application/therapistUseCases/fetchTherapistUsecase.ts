import dependencies from "../../frameworks/config/dependencies";
import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    const executeFunction = async (therapistId: string) => {
        try {
            const response = await therapistRepository.getTherapistProfit({therapistId});
        
            if(response.status) {
                return { status: true, 
                    totalProfit: response.totalProfit,
                    mostBookedHour: response.mostBookedHour,
                    userName: response.userName
                };
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_THERAPIST_USECASE };
        }
    }
    return {executeFunction}
}