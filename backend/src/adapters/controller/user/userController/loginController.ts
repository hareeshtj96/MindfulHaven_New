import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export default function userLogin (dependencies: any) {
    const { userRepository } = dependencies.repository;

    const loginController = async (req: Request, res: Response) => {
        console.log("entered login controller:")
        try {
            const { email, password } = req.body;
            console.log("req body:", req.body);


            // Find the user by email
            const user = await userRepository.getUserByEmail({ email });
            console.log('user:', user);

            if (!user.status) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: ResponseMessages.USER_NOT_FOUND });
            }
            if (user.data.isBlocked) {
                return res.status(HttpStatusCode.FORBIDDEN).json({ message: ResponseMessages.USER_IS_BLOCKED });
            }

            console.log("secret key....", SECRET_KEY);

            // Compare provided password with the stored hashed password
            const validPassword = await bcrypt.compare(password, user.data.password);
            if (!validPassword) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: ResponseMessages.INVALID_PASSWORD });
            }

            // Generate JWT token upon successful login
            const token = jwt.sign(
                { userId: user.data._id, email: user.data.email, name: user.data.name, role: user.data.role, mobile: user.data.mobile },
                SECRET_KEY,
                { expiresIn: "20m" }
            );

            // Generate Refresh token
            const refreshToken = jwt.sign(
                { userId: user.data._id, email: user.data.email, name: user.data.name, role: user.data.role },
                REFRESH_SECRET_KEY,
                {expiresIn: "7d"}
            );

            // Set Refresh token in HTTP-only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            console.log("setting refresh token cookie:", refreshToken);

            // Send response
            res.json({ status: true, token });
        } catch (error) {
            console.error("Error in loginController:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    };

    return loginController;
};
