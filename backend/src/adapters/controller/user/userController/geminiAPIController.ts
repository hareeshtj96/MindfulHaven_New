import { Request, response, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";

const formatResponse = (data: any) => {

    let formattedData = data.replace(/\*/g, '');

    formattedData = formattedData
        .replace(/\r?\n/g, ' ') 
        .replace(/\s+/g, ' ') 
        .replace(/<br>/g, '')
        .replace(/<strong>/g, '')
        .trim(); 

    formattedData = formattedData.replace(/([A-Z][a-z]+):/g, '<strong>$1:</strong>');

    formattedData = formattedData.replace(/<\/strong>\s<strong>/g, ' '); 

    formattedData = formattedData.replace(/<\/?strong>/g, '');

    formattedData = formattedData.replace(/<strong>Triggers:/g, 'Triggers:'); 

    return formattedData;
};

export default (dependencies: any) => {
    const { geminiAPIUsecase } = dependencies.useCase;

    const geminiAPIController = async (req: Request, res: Response) => {
        console.log(" entered gemini api controller.........");

        try {
            const { query } = req.body;
            console.log(" request body:", req.body);


            const apiResponse = await geminiAPIUsecase(dependencies).executeFunction({query });
            console.log("api response:", apiResponse);

            if (apiResponse && apiResponse.status) {
                const formattedData = formatResponse(apiResponse.data);
                res.status(200).json({ status: true, data: formattedData });
                
            } else {
                res.status(400).json({ status: false, message: apiResponse.message || "Data not found" })
            }
            
            
        } catch (error) {
            console.error("Error in Gemini API Controller:", error);
            return res.status(500).json({ status: false, message: "Internal Server Error"});
        }
        
    }
    return geminiAPIController;
}