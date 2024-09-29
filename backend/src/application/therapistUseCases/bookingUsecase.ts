
export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    interface StatusParams {
        therapistId: string;
        page: number;
        limit: number
       
    }    

    const executeFunction = async ({ therapistId, page, limit }: StatusParams) => {
        console.log("entered use case:.....")
        try {
            console.log(" receieved in use case:", therapistId, page, limit)
            const response = await therapistRepository.getBookings( therapistId, page, limit);
           
            if(response.status) {
                return { status: true, data: response.data, totalPages: response.totalPages};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in booking details useCase"};
        }
    }
    return {executeFunction}
}