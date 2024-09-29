
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
            return { status: false, message: "Error in slot useCase"};
        }
    }
    return {executeFunction}
}