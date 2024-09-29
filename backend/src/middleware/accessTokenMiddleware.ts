import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface CustomRequest extends Request {
    email?: string;
    role?: string;
}

interface jwtPayload {
    email: string;
    role: string;
}

const SECRET_KEY = process.env.JWT_SECRET || "default_key";

export const verifyAccessToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: "No access token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err) {
            if(err instanceof TokenExpiredError) {
                console.log("Access token expired:", err.expiredAt);
                return res.status(401).json({ message: "Access token expired", needRefresh: true})
                
            } else {
                return res.status(403).json({ message: 'Invalid access token'})
            }
        }

        const payload = decoded as JwtPayload; 
        req.email = payload.email;
        req.role = payload.role;

        next();
    })
}