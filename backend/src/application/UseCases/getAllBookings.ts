import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (requestData: { userId: string, page: number, limit: number}) => {
     
        try {
            const {userId, page, limit} = requestData;
            const response = await userRepository.getAllBooking(userId, page, limit);
            
            if(response) {
                return { status: true, data: response};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_BOOKING_USE_CASE };
        }
    }
    return {executeFunction}
}