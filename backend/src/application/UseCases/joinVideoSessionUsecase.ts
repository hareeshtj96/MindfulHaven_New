import { exec } from "child_process";
import dependencies from "../../frameworks/config/dependencies";
import { generateZegoToken } from "../../utils/generateZegoToken";

export default (dependencies: any) => {
    const executeFunction = async ({ userId, bookingId }: { userId: string; bookingId: string}) => {
        console.log("entered join video session use case....");

        try {
            const roomId = bookingId;
            const roomToken = generateZegoToken(userId, roomId);

            console.log("Generated zego token for room:", roomToken);

            return { status: true, data: { roomId, roomToken }}
            
        } catch (error) {
            console.error("Error in join video session use case:", error);
            return { status: false, message: "Failed to join video session"}
        }
        
    }
    return { executeFunction }
}