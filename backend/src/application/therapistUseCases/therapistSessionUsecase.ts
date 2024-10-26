import { generateZegoToken } from "../../utils/generateZegoToken";
import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const executeFunction = async ({ therapistId, bookingId }: { therapistId: string; bookingId: string}) => {
        try {
            const roomId = bookingId;
            const roomToken = generateZegoToken(therapistId, roomId);

            return { status: true, data: { roomId, roomToken }}
            
        } catch (error) {
            return { status: false, message: ResponseMessages.UNABLE_TO_JOIN_VIDEO }
        }
        
    }
    return { executeFunction }
}