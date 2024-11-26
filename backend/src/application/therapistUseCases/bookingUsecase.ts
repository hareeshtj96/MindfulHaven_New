import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    interface StatusParams {
        therapistId: string;
        page: number;
        limit: number,
        status: string,
       
    }    

    const executeFunction = async ({ therapistId, page, limit, status }: StatusParams) => {
        try {
            const response = await therapistRepository.getBookings( therapistId, page, limit, status);
            
            if(response.status) {
                return { status: true, 
                    data: response.data, 
                    totalPagesBooking: response.totalPagesBooking, 
                    currentPagesBooking: response.currentPagesBooking};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_THERAPIST_USECASE };
        }
    }
    return {executeFunction}
}