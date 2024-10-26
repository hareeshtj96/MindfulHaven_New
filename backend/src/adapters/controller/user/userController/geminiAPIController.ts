import { Request, response, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

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
        try {
            const { query } = req.body;
          
            const apiResponse = await geminiAPIUsecase(dependencies).executeFunction({query });
        
            if (apiResponse && apiResponse.status) {
                const formattedData = formatResponse(apiResponse.data);
                res.status(HttpStatusCode.OK).json({ status: true, data: formattedData });
                
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: apiResponse.message || ResponseMessages.DATA_NOT_FOUND })
            }
               
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
        
    }
    return geminiAPIController;
}