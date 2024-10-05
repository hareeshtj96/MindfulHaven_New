import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "default";
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

if (!REFRESH_SECRET_KEY) {
    throw new Error('REFRESH_SECRET_KEY is not defined in the environment');
}

export const refreshTokenController = (dependencies: any) => {
    console.log("entered refresh token controller............");
    
    return (req: Request, res: Response) => {
        

        console.log("cookied received:", req.cookies);

        const refreshToken = req.cookies['refreshToken'];
        console.log("refresh token from controller:", refreshToken);

        if (!refreshToken) {
            return res.status(403).json({ message: 'Refresh token not provided' });
        }

        // Verify refresh token
        jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err:any, decoded:any) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
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
                console.log("new access token:", newAccessToken);

                // Generate new refresh token
                const newRefreshToken = jwt.sign(
                    { email,  role },
                    REFRESH_SECRET_KEY,
                    { expiresIn: '7d' }
                );

                console.log("new refresh token:", newRefreshToken);

                // Set the new refresh token as a cookie
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

                return res.json({ accessToken: newAccessToken });
            }

            return res.status(403).json({ message: 'Invalid refresh token payload' });
        });
    }
};
