import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;

    interface StatusParams {
        therapistId: string;
       
    }    

    const executeFunction = async ({ therapistId }: StatusParams) => {
        try {
            const response = await adminRepository.therapistDetails( therapistId);
        
            if(response.status) {
                return { status: true, data: response.therapist};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_ADMIN_USECASE };
        }
    }
    return {executeFunction}
}