import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (details: string) => {
        console.log("entered use case:.....")
        console.log("details.....", details);
        try {
            const response = await userRepository.getSubmitIssue(details);
            console.log("response from submit issue usecase:", response);
            
            if(response && response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: ResponseMessages.ERROR_IN_SUBMIT_ISSUE };
        }
    }
    return {executeFunction}
}