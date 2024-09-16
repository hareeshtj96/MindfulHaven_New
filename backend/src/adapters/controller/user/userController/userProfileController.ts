import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { getUserProfileUsecase } = dependencies.useCase;

    const userProfileController = async (req: Request, res: Response) => {
        console.log("entered user profile..........");
        try {
            const authHeader = req.headers.authorization;
            console.log("authheader:", authHeader);

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ status: false, message: "Authorization header is missing or invalid" });
            }

            // Extract token from 'Bearer <token>' format
            const token = authHeader.split(' ')[1];
            console.log("token:", token);

            if (!token) {
                return res.status(401).json({ status: false, message: "Token is missing" });
            }

            // Verify and decode the token
            const decodedToken: any = jwt.verify(token, SECRET_KEY);
            console.log("decoded token:", decodedToken);
            const email = decodedToken.email;
            console.log("email from decoded token:", email);

            if (!email) {
                return res.status(400).json({ status: false, message: "Email not found in the token" });
            }

            const response = await getUserProfileUsecase(dependencies).executeFunction({ email });
            console.log("response from user profile controller:", response);

            if (response && response.status) {
                console.log("response from controller:", response);
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(404).json({ status: false, message: "Data not found" });
            }
        } catch (error) {
            console.error("Error in get user profile:", error);
            return res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    }
    return userProfileController;
}
