import jwt, { VerifyErrors } from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { therapistRepository } = dependencies.repository;

    const verifyOtp = async (req: Request, res: Response) => {
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
                const therapistData = decoded.TherapistData;
                console.log("therapist data:", therapistData);

                if (!therapistData) {
                    return res.status(400).json({ status: false, message: "User data is missing" });
                }

                try {
                    const result = await therapistRepository.createtherapist(therapistData);
                    console.log("result:", result);
                    res.json({ status: true, message: "OTP is verified and therapist is registered successfully", data: result });
                } catch (dbError) {
                    console.error("Error saving therapist to the database:", dbError);
                    res.status(500).json({ status: false, message: "Failed to save therapist data" });
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

    return verifyOtp;
};
