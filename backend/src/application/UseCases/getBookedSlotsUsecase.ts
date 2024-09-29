
export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (therapistId: string) => {
        console.log("entered booked use case:.....")
        console.log("therapist id from use case:", therapistId);
        
        try {
            const response = await userRepository.getBookedSlot(therapistId);
            console.log("response from booked use case:", response);
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in booked slot useCase"};
        }
    }
    return {executeFunction}
}