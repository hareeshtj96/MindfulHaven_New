export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;

    
    const executeFunction = async () => {
        console.log("entered use case:.....")
        try {
           
            const response = await adminRepository.dashboardDetails();
        
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message || "Error fetching data"}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in admin dashboard details useCase"};
        }
    }
    return {executeFunction}
}