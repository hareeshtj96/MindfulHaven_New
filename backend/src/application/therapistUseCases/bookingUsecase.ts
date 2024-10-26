import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    interface StatusParams {
        therapistId: string;
        page: number;
        limit: number
       
    }    

    const executeFunction = async ({ therapistId, page, limit }: StatusParams) => {
        try {
            const response = await therapistRepository.getBookings( therapistId, page, limit);
           
            if(response.status) {
                return { status: true, data: response.data, totalPages: response.totalPages};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_THERAPIST_USECASE };
        }
    }
    return {executeFunction}
}