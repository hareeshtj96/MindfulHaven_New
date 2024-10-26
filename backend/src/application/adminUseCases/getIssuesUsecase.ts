import { ResponseMessages } from "../../utils/httpStatusCode";

import dependencies from "../../frameworks/config/dependencies";

export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;

    const executeFunction = async () => {
        try {
            const response = await adminRepository.getAllIssues();

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_ADMIN_USECASE };
        }
    }
    return {executeFunction}
}