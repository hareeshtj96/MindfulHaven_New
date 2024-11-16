import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (therapistId: string, slotDate: string, slotTime: string) => {
      
        try {
            const response = await userRepository.checkSlotBeforePayment(therapistId, slotDate, slotTime);    
            
            if(response.status) {
                return { status: true, message: response.message};
            } else  {
                return { status: false, message: response.message}
            }
            
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_BOOKED_SLOT_USECASE };
        }
    }
    return {executeFunction}
}