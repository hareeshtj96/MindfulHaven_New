import dependencies from "../../frameworks/config/dependencies";

export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;

    const executeFunction = async (requestData: any) => {
        try {
            const response = await adminRepository.getAllTherapists(requestData);

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in adminUseCase"};
        }
    }
    return {executeFunction}
}