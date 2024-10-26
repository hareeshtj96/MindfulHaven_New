import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import dotenv from 'dotenv';
import { SendOtp } from "../../../../utils";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const resendOtpController =  async (req: Request, res: Response) => {

        try {
            const authHeader = req.headers.authorization;
            if(!authHeader) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.AUTHORIZATION_HEAD_MISSING });
            }

            const token = authHeader.split(" ")[1];
            if(!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_MISSING });
            }

            const decodedToken: any = jwt.verify(token, SECRET_KEY);
            
            const email = decodedToken.userData.email;
           
            if(!email) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.EMAIL_NOT_FOUND_IN_TOKEN });
            }

           
            const response = await SendOtp(email);
           
            if(!response.status) {
                return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.FAILED_TO_SENT_OTP })
            }

            const newToken = jwt.sign(
                {otp: response.otp, userData: {email}},
                SECRET_KEY,
                { expiresIn: "10m"}
            );
            
            res.json({ status: true, message: ResponseMessages.OTP_RESENT_SUCCESSFULLY, token: newToken});
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return resendOtpController;
}