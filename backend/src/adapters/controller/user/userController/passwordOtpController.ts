import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";
import dependencies from "../../../../frameworks/config/dependencies";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const resetPasswordOtpcontroller = async(req: Request, res: Response) => {

        console.log(" entered reset password otp controller......");
        try {
            const { otp } = req.body;
            console.log("Otp from request body:", otp);

            const authHeader = req.headers.authorization;
            console.log("authHeader:", authHeader);

            const token = authHeader?.split(" ")[1];
            console.log("token:", token);

            if(!token) {
                return res.status(401).json({ status: false, message: "Token is missing"})
            }

            let decoded: any;
            try {
                decoded = jwt.verify(token, SECRET_KEY)  as jwt.JwtPayload;;
                console.log("decoded token data:", decoded);
            } catch (error) {
                console.error("Error verifying token:", error);
                return res.status(401).json({ status: false, message: "Invalid or expired token"})
            }

            if(decoded.otp === otp) {
                console.log("OTP verified successfully");

                const email = decoded.email
                console.log("Email from tokn:", email);

                res.json({ status: true, message: "OTP is verified. You can reset the password", email}); 
            } else {
                console.log("Incorrect OTP provided");
                res.status(400).json({ status: false ,message: "Incorrect OTP"})
            }
        } catch (error) {
            console.error("Error in OTP verification:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    return resetPasswordOtpcontroller;
}