import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    interface StatusParams {
        bookingId: string;
        userId: string;
    }    

    const executeFunction = async ({ bookingId, userId }: StatusParams) => {
        
        try {
            const response = await userRepository.cancelAppointment({ bookingId, userId});
          
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_CANCEL_APPOINTMENT_USECASE };
        }
    }
    return {executeFunction}
}