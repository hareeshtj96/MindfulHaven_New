
export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    interface StatusParams {
        bookingId: string;
       
    }    

    const executeFunction = async ({ bookingId }: StatusParams) => {
        console.log("entered use case:.....")
        try {
            console.log(" receieved in use case:", bookingId)
            const response = await userRepository.bookingDetails({ bookingId});
            console.log("response from booking use case:", response);

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in booking details useCase"};
        }
    }
    return {executeFunction}
}