
export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (requestData: any) => {
        console.log("entered use case:.....")
        try {
            const response = await userRepository.getChildTherapist(requestData);
            console.log("response from user profile use case:", response);

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in therapistUseCase"};
        }
    }
    return {executeFunction}
}