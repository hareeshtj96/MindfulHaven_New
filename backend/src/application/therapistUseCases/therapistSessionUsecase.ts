import { generateZegoToken } from "../../utils/generateZegoToken";

export default (dependencies: any) => {
    const executeFunction = async ({ therapistId, bookingId }: { therapistId: string; bookingId: string}) => {
        console.log("entered join therapist video session use case....");

        try {
            const roomId = bookingId;
            const roomToken = generateZegoToken(therapistId, roomId);

            console.log("Generated zego token for room:", roomToken);

            return { status: true, data: { roomId, roomToken }}
            
        } catch (error) {
            console.error("Error in join video session use case:", error);
            return { status: false, message: "Failed to join video session"}
        }
        
    }
    return { executeFunction }
}