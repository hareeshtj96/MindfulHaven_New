
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
        console.log("entered use case:.....")
        try {
            console.log(" receieved in use case:", therapistId, userId, slot, notes, paymentId)
            const response = await userRepository.saveAppointment({ therapistId, userId, slot, notes, paymentId });
           
            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in slot useCase"};
        }
    }
    return {executeFunction}
}