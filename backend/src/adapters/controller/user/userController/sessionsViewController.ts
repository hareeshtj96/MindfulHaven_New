import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { getAllBookings } = dependencies.useCase;

    const sessionsViewController = async (req: Request, res: Response ) => {

        try {
            const page = parseInt(req.query.page as string, 10) || 1;
          
            const limit = parseInt(req.query.limit as string, 10) || 2
           
            const authHeader = req.headers.authorization;
        
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.AUTHORIZATION_HEAD_MISSING });
            }

            const token = authHeader.split(' ')[1];
            
            if (!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_MISSING });
            }

            // Verify and decode the token
            const decodedToken: any = jwt.verify(token, SECRET_KEY);
            
            const userId = decodedToken.userId;
           
            if (!userId) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.USER_ID_NOT_IN_TOKEN });
            }

            const response = await getAllBookings(dependencies).executeFunction({ userId, page, limit });

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({status: false, message: ResponseMessages.TOKEN_EXPIRED });
        }
    }
    return sessionsViewController;
}