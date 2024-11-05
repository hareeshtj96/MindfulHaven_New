import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpStatusCode, ResponseMessages } from "../utils/httpStatusCode";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "secret_key";

interface RequestWithUser extends Request {
    user?: {
      therapistId: string;
    };
}


export const therapistTokenAuthenticate = (req: RequestWithUser, res: Response, next: NextFunction) => {
  
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.AUTHORIZATION_HEAD_MISSING});
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_MISSING})
    }

    try {
        const decodedToken: any = jwt.verify(token, SECRET_KEY);
        req.user = { therapistId: decodedToken.therapistId };
        next();
    } catch (error) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.INVALID_TOKEN_PAYLOAD})
    }
}