import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpStatusCode, ResponseMessages } from '../../../../utils/httpStatusCode';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "default";
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

if (!REFRESH_SECRET_KEY) {
    throw new Error('REFRESH_SECRET_KEY is not defined in the environment');
}

export const refreshTokenController = (dependencies: any) => {
    
    return (req: Request, res: Response) => {
        const refreshToken = req.cookies['refreshToken'];
       
        if (!refreshToken) {
            return res.status(HttpStatusCode.FORBIDDEN).json({ message: ResponseMessages.REFRESH_TOKEN_NOT_PROVIDED });
        }

        // Verify refresh token
        jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err:any, decoded:any) => {
            if (err) {
                return res.status(HttpStatusCode.FORBIDDEN).json({ message: ResponseMessages.INVALID_REFRESH_TOKEN });
            }

            // Check if decoded is JwtPayload to access its properties
            if (decoded && typeof decoded !== 'string') {
                const { email, role } = decoded as JwtPayload;

                // Generate new access token
                const newAccessToken = jwt.sign(
                    {  email,  role },
                    SECRET_KEY,
                    { expiresIn: '20m' }
                );
                
                // Generate new refresh token
                const newRefreshToken = jwt.sign(
                    { email,  role },
                    REFRESH_SECRET_KEY,
                    { expiresIn: '7d' }
                );

                // Set the new refresh token as a cookie
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

                return res.json({ accessToken: newAccessToken });
            }

            return res.status(HttpStatusCode.FORBIDDEN).json({ message: ResponseMessages.INVALID_REFRESH_TOKEN_PAYLOAD });
        });
    }
};
