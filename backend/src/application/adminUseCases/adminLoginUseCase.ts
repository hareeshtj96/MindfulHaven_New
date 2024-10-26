
export default (dependencies:any) => {
    const {adminRepository} = dependencies.repository;

    const executeFunction = async (data: {email:string; password: string}) => {
        try {
            const result = await adminRepository.getAdminByEmail(data.email, data.password);
            
            return result;
        } catch (error) {
            throw error;
        }
    };
    return {
        executeFunction:executeFunction
    }
}