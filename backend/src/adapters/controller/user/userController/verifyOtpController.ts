import jwt, { VerifyErrors } from "jsonwebtoken";
import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const verifyOtpController = async (req: Request, res: Response) => {
        try {
            const { otp } = req.body;
            
            const authHeader = req.headers.authorization;
          
            const token = authHeader?.split(" ")[1];
            
            if (!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_MISSING });
            }

            let decoded: any;
            try {
                decoded = jwt.verify(token, SECRET_KEY);
            } catch (err) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_EXPIRED });
            }

            // Compare the OTP from the token with the OTP provided in the request body
            if (decoded.otp === otp) {
                const userData = decoded.userData;
                
                if (!userData) {
                    return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.USER_DATA_MISSING });
                }

                try {
                    const result = await userRepository.createUser(userData);
                    res.json({ status: true, message: ResponseMessages.OTP_VERIFIED_USER_REGISTERED_SUCCESSFULLY, data: result });
                } catch (dbError) {
                    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.FAILED_TO_SAVE_USER_DATA });
                }
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.INCORRECT_OTP });
            }
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    };

    return verifyOtpController;
};
