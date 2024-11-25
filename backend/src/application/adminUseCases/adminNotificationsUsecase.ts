import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;

    const executeFunction = async () => {
        try {
            const response = await adminRepository.adminNotifications();
            console.log("response from notification usecase:", response);
            
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_ADMINNOTIFICATIONS_USECASE };
        }
    }
    return {executeFunction}
}