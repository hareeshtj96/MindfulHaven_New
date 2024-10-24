import { exec } from "child_process";
import dependencies from "../../frameworks/config/dependencies";
import { generateZegoToken } from "../../utils/generateZegoToken";
import { ResponseMessages } from "../../utils/httpStatusCode";

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
            return { status: false, message: ResponseMessages.UNABLE_TO_JOIN_VIDEO }
        }
        
    }
    return { executeFunction }
}