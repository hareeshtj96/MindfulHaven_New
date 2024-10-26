import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    interface StatusParams {
        bookingId: string;
    
       
    }    

    const executeFunction = async ({ bookingId }: StatusParams) => {
        try {
          
            const response = await therapistRepository.cancelAppointmentTherapist({ bookingId });
           
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_THERAPIST_USECASE };
        }
    }
    return {executeFunction}
}