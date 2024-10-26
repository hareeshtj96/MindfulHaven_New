import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    interface AppointmentParams {
        therapistId: string;
        userId: string; 
        slot: Date; 
        notes?: string; 
        paymentId: any
    }    

    const executeFunction = async ({ therapistId, userId, slot, notes, paymentId}: AppointmentParams) => {
        try {
            const response = await userRepository.saveAppointment({ therapistId, userId, slot, notes, paymentId });
           
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_SLOT_USECASE };
        }
    }
    return {executeFunction}
}