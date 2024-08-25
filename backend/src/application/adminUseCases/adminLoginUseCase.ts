
export default (dependencies:any) => {
    const {adminRepository} = dependencies.repository;

    const executeFunction = async (data: {email:string; password: string}) => {
        try {
            const result = await adminRepository.getAdminByEmail(data.email, data.password);
            console.log("result from executefunction:", result);

            return result;
        } catch (error) {
            console.error("Error in execute function:", error);
            throw error;
        }
    };
    return {
        executeFunction:executeFunction
    }
}