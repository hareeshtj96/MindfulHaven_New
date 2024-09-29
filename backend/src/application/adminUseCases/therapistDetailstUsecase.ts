export default (dependencies: any) => {
    const { adminRepository } = dependencies.repository;

    interface StatusParams {
        therapistId: string;
       
    }    

    const executeFunction = async ({ therapistId }: StatusParams) => {
        console.log("entered use case:.....")
        try {
            console.log(" receieved in use case:", therapistId)
            const response = await adminRepository.therapistDetails( therapistId);
        
            if(response.status) {
                return { status: true, data: response.therapist};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in therapist details useCase"};
        }
    }
    return {executeFunction}
}