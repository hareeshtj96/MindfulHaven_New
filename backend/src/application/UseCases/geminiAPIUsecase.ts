import dependencies from "../../frameworks/config/dependencies";
import { run } from "../../utils/geminiAPI";
import { ResponseMessages } from "../../utils/httpStatusCode";

export default (dependencies: any) => {
    const executeFunction = async (requestData: { query: string }) => {
        console.log(" entered gemini use case");
        console.log("Request data:", requestData);


        try {
            const { query } = requestData;

            const response = await run(query);
            console.log(" response from api use case:", response);

            if (response) {
                return { status: true, data: response};
            } else {
                return { status: false, message: ResponseMessages.NO_RESPONSE_FROM_GEMINI }
            }
            
        } catch (error) {
            console.error("Error in Gemini API use case:", error);
            return { status: false, message: ResponseMessages.ERROR_IN_GEMINI_USECASE };
        }
        
    }
    return { executeFunction }
}