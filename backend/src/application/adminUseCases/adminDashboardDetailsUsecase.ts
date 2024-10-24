import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;
    
    const executeFunction = async () => {
        console.log("entered use case:.....")
        try {
           
            const response = await adminRepository.dashboardDetails();
        
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message || ResponseMessages.ERROR_FETCHING_DATA }
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: ResponseMessages.ERROR_IN_ADMIIN_DASHBOARD_USECASE };
        }
    }
    return {executeFunction}
}