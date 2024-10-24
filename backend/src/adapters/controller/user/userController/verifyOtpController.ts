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
            console.log("otp from request body:", otp);

            const authHeader = req.headers.authorization;
            console.log("authHeader:", authHeader);

            const token = authHeader?.split(" ")[1];
            console.log("token:", token);

            if (!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_MISSING });
            }

            let decoded: any;
            try {
                decoded = jwt.verify(token, SECRET_KEY);
                console.log("decoded token data:", decoded);
            } catch (err) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_EXPIRED });
            }

            // Compare the OTP from the token with the OTP provided in the request body
            if (decoded.otp === otp) {
                const userData = decoded.userData;
                console.log("user data from otp controller", userData);

                if (!userData) {
                    return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.USER_DATA_MISSING });
                }

                try {
                    const result = await userRepository.createUser(userData);
                    res.json({ status: true, message: ResponseMessages.OTP_VERIFIED_USER_REGISTERED_SUCCESSFULLY, data: result });
                } catch (dbError) {
                    console.error("Error saving user to the database:", dbError);
                    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.FAILED_TO_SAVE_USER_DATA });
                }
            } else {
                console.log("Incorrect OTP provided");
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.INCORRECT_OTP });
            }
        } catch (error) {
            console.error("Error in OTP verification:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    };

    return verifyOtpController;
};
