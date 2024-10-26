import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default function resetPassword(dependencies: any) {
    const { resetPassword } = dependencies.useCase;

    const resetPasswordController = async (req: Request, res: Response) => {
        try {
            const { newPassword, confirmPassword } = req.body;
            
            // Extract token from Authorization header
            const authHeader = req.headers.authorization;

            const token = authHeader?.split(" ")[1];
            if (!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_MISSING });
            }

            // Decode the token to extract the email
            let decoded: any;
            try {
                decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
            } catch (error) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_EXPIRED });
            }

            const email = decoded.email;
            if (!email) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.EMAIL_NOT_FOUND_IN_TOKEN });
            }

            // Pass the email along with new password and confirm password to the use case
            const forgot = resetPassword(dependencies);
            const result = await forgot.executionFunction({ email, newPassword, confirmPassword });

            if (result.status) {
                res.json({ status: true, message: ResponseMessages.PASSWORD_RESET_SUCCESSFULLY });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: result.data });
            }
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    };

    return resetPasswordController;
}
