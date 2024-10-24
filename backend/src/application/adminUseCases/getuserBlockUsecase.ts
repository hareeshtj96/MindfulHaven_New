import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;

    const executeFunction = async (userId: string) => {
        try {
            const response = await adminRepository.getBlock(userId);
            console.log("response from execute function:", response);

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: ResponseMessages.ERROR_IN_ADMIN_USECASE };
        }
    }
    return {executeFunction}
}