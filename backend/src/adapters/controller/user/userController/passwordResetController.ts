import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default function resetPassword(dependencies: any) {
    const { resetPassword } = dependencies.useCase;

    const resetPasswordController = async (req: Request, res: Response) => {
        console.log("Entered reset password controller");

        try {
            const { newPassword, confirmPassword } = req.body;
            console.log("request body:", req.body);

            // Extract token from Authorization header
            const authHeader = req.headers.authorization;

            const token = authHeader?.split(" ")[1];
            console.log("token from resetcontroller:", token);
            if (!token) {
                return res.status(401).json({ status: false, message: "Token is missing" });
            }

            // Decode the token to extract the email
            let decoded: any;
            try {
                decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
                console.log("Decoded token data:", decoded);
            } catch (error) {
                console.error("Error verifying token:", error);
                return res.status(401).json({ status: false, message: "Invalid or expired token" });
            }

            const email = decoded.email;
            if (!email) {
                return res.status(400).json({ status: false, message: "Email not found in token" });
            }

            console.log("Email extracted from token:", email);

            // Pass the email along with new password and confirm password to the use case
            const forgot = resetPassword(dependencies);
            const result = await forgot.executionFunction({ email, newPassword, confirmPassword });

            console.log("Result from reset password controller:", result);

            if (result.status) {
                res.json({ status: true, message: "Password reset successful" });
            } else {
                res.status(400).json({ status: false, message: result.data });
            }
        } catch (error) {
            console.error("Error in reset password controller:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    };

    return resetPasswordController;
}
