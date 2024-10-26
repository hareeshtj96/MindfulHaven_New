import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (details: string) => {
        try {
            const response = await userRepository.getSubmitIssue(details);
           
            if(response && response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_SUBMIT_ISSUE };
        }
    }
    return {executeFunction}
}