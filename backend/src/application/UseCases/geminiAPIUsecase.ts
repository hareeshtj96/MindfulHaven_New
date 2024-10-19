import dependencies from "../../frameworks/config/dependencies";
import { run } from "../../utils/geminiAPI";

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
                return { status: false, message: "No respones from Gemini API"}
            }
            
        } catch (error) {
            console.error("Error in Gemini API use case:", error);
            return { status: false, message: "Error in Gemini API use case"};
        }
        
    }
    return { executeFunction }
}