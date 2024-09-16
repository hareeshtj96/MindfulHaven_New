import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from 'dotenv';
import { SendOtp } from "../../../../utils";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const resendOtpController =  async (req: Request, res: Response) => {

        console.log("..... enter resend otp........")
        try {
            const authHeader = req.headers.authorization;
            if(!authHeader) {
                return res.status(401).json({ status: false, message: "Authorization header is missing"});
            }

            const token = authHeader.split(" ")[1];
            console.log("token from resend otp:", token);
            if(!token) {
                return res.status(401).json({ status: false, message: "Token is missing"});
            }

            const decodedToken: any = jwt.verify(token, SECRET_KEY);
            console.log("decode token:", decodedToken);

            const email = decodedToken.userData.email;
            console.log("email from decoded token:", email);

            if(!email) {
                return res.status(400).json({ status: false, message: "Email not found in the token"});
            }

           
            const response = await SendOtp(email);
            console.log("response from resend otp:", response);
            if(!response.status) {
                return res.status(500).json({ status: false, message: "Failed to send OTP"})
            }

            const newToken = jwt.sign(
                {otp: response.otp, userData: {email}},
                SECRET_KEY,
                { expiresIn: "10m"}
            );
            console.log("new token :", newToken);
            res.json({ status: true, message: "OTP resent successfully", token: newToken});
        } catch (error) {
            console.error("Error in resend OTP:", error);
            res.status(500).json({ message: "Internal Server Error"});
        }
    }
    return resendOtpController;
}