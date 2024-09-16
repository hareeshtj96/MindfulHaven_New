
export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;

    const executeFunction = async (therapistId: string) => {
        try {
            const response = await adminRepository.getVerified(therapistId);
            console.log("response from execute function:", response);

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