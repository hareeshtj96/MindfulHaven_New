import jwt, { VerifyErrors } from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const verifyOtpController = async (req: Request, res: Response) => {
        try {
            const { otp } = req.body;
            console.log("otp from request body:", otp);

            const authHeader = req.headers.authorization;
            console.log("authHeader:", authHeader);

            const token = authHeader?.split(" ")[1];
            console.log("token:", token);

            if (!token) {
                return res.status(401).json({ status: false, message: "Token is missing" });
            }

            let decoded: any;
            try {
                decoded = jwt.verify(token, SECRET_KEY);
                console.log("decoded token data:", decoded);
            } catch (err) {
                return res.status(401).json({ status: false, message: "Invalid or expired token" });
            }

            // Compare the OTP from the token with the OTP provided in the request body
            if (decoded.otp === otp) {
                const userData = decoded.userData;
                console.log("user data from otp controller", userData);

                if (!userData) {
                    return res.status(400).json({ status: false, message: "User data is missing" });
                }

                try {
                    const result = await userRepository.createUser(userData);
                    res.json({ status: true, message: "OTP is verified and user is registered successfully", data: result });
                } catch (dbError) {
                    console.error("Error saving user to the database:", dbError);
                    res.status(500).json({ status: false, message: "Failed to save user data" });
                }
            } else {
                console.log("Incorrect OTP provided");
                res.status(400).json({ status: false, message: "Incorrect OTP" });
            }
        } catch (error) {
            console.error("Error in OTP verification:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    return verifyOtpController;
};
