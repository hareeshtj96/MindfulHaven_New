import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (therapistId: string) => {
        console.log("entered use case:.....")
        try {
            const response = await userRepository.getSlot(therapistId);

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: ResponseMessages.ERROR_IN_SLOT_USECASE };
        }
    }
    return {executeFunction}
}