
export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (requestData: { email: string, page: number, limit: number}) => {
        console.log("entered use case:.....")
        console.log("request data:", requestData);
        try {
            const {email, page, limit} = requestData;
            const response = await userRepository.getCompletedBooking(email, page, limit);
            console.log("response from get complted bookings use case:", response);

            if(response) {
                return { status: true, data: response};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in get completed booking useCase"};
        }
    }
    return {executeFunction}
}