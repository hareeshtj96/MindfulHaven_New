import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    interface StatusParams {
        therapistId: string;
    }    

    const executeFunction = async ({ therapistId }: StatusParams) => {
        try {
            const response = await therapistRepository.therapistNotifications({therapistId });
            
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_THERAPISTNOTIFICATIONS_USECASE };
        }
    }
    return {executeFunction}
}