import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;

    const executeFunction = async (issueId: string) => {
        try {
            const response = await adminRepository.getIssueResolved(issueId);
            
            if(response.status) {
                return { status: true, message: response.message};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_ADMIN_USECASE };
        }
    }
    return {executeFunction}
}