import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default";
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

if (!REFRESH_SECRET_KEY) {
    throw new Error('REFRESH_SECRET_KEY is not defined in the environment');
}

export const refreshTokenController = (dependencies: any) => {
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
                    { user: email, role: role },
                    SECRET_KEY,
                    { expiresIn: '20m' }
                );

                // Generate new refresh token
                const newRefreshToken = jwt.sign(
                    { user: email, role: role },
                    REFRESH_SECRET_KEY,
                    { expiresIn: '7d' }
                );

                // Set the new refresh token as a cookie
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

                return res.json({ accessToken: newAccessToken });
            }

            return res.status(403).json({ message: 'Invalid refresh token payload' });
        });
    }
};
