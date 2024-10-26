import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    interface StatusParams {
        bookingId: string;
       
    }    

    const executeFunction = async ({ bookingId }: StatusParams) => {
        try {
           
            const response = await userRepository.bookingDetails({ bookingId});
           
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_BOOKING_DETAILS_USECASE};
        }
    }
    return {executeFunction}
}