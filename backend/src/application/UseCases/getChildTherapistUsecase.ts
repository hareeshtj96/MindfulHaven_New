
export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (requestData: {page: number, limit: number}) => {
        console.log("entered use case:.....")
        try {
            const {page, limit} = requestData;
            const response = await userRepository.getChildTherapist(page, limit);

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