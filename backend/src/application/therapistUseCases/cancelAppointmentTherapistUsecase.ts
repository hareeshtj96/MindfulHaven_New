export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    interface StatusParams {
        bookingId: string;
    
       
    }    

    const executeFunction = async ({ bookingId }: StatusParams) => {
        console.log("entered therapist use case:.....")
        try {
            console.log(" receieved in use case:", bookingId)
            const response = await therapistRepository.cancelAppointmentTherapist({ bookingId });
            console.log("response from cancel appointment use case:", response);

            if(response.status) {
                return { status: true, data: response.data};
            } else  {
                return { status: false, message: response.message}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in cancel appointment useCase"};
        }
    }
    return {executeFunction}
}