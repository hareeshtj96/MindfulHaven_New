import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    interface StatusParams {
        bookingId: string;
        userId: string;
       
    }    

    const executeFunction = async ({ bookingId, userId }: StatusParams) => {
        console.log("entered use case:.....")
        try {
            console.log(" receieved in use case:", bookingId, userId)
            const response = await userRepository.cancelAppointment({ bookingId, userId});
            console.log("response from cancel appointment use case:", response);

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: ResponseMessages.ERROR_IN_CANCEL_APPOINTMENT_USECASE };
        }
    }
    return {executeFunction}
}