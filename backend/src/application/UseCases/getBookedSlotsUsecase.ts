import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (therapistId: string) => {
      
        try {
            const response = await userRepository.getBookedSlot(therapistId);
            
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_BOOKED_SLOT_USECASE };
        }
    }
    return {executeFunction}
}