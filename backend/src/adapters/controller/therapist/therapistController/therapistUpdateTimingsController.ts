import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import jwt, { JwtPayload } from "jsonwebtoken";
import dependencies from "../../../../frameworks/config/dependencies";
import dotenv from 'dotenv'
import { start } from "repl";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { updateTherapistTimingsUsecase } = dependencies.useCase;

    const therapistUpdateTimingsController = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.UNAUTHORIZED });
            
            }

            const decodedToken = jwt.verify(token, SECRET_KEY ) as JwtPayload
          
            const email = decodedToken.email
           
            const { startTime, endTime, date } = req.body;
            
            const response = await updateTherapistTimingsUsecase(dependencies).executeFunction({email, startTime, endTime, date});

            if (response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data })
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message});
            }
        } catch (error) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_EXPIRED });
        }
        
    };
    return therapistUpdateTimingsController;
}