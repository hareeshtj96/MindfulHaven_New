import dependencies from "../../frameworks/config/dependencies";

export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    const executeFunction = async (requestData: any) => {
        try {
            const response = await therapistRepository.getProfile(requestData);

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