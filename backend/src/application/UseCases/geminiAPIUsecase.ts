import dependencies from "../../frameworks/config/dependencies";
import { run } from "../../utils/geminiAPI";
import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const executeFunction = async (requestData: { query: string }) => {
        try {
            const { query } = requestData;

            const response = await run(query);
            
            if (response) {
                return { status: true, data: response};
            } else {
                return { status: false, message: ResponseMessages.NO_RESPONSE_FROM_GEMINI }
            }
            
        } catch (error) {
            return { status: false, message: ResponseMessages.ERROR_IN_GEMINI_USECASE };
        }
        
    }
    return { executeFunction }
}