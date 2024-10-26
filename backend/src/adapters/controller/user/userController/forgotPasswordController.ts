import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

dotenv.config();


interface ForgotPasswordRequestBody {
    email: string;
}

interface ForgotPasswordResponse {
    status: boolean;
    message: string;
    token?: string;
}

export default function forgotPassword(dependencies: any) {
    const { forgotPassword } = dependencies.useCase;
    
    const forgotPasswordController = async (req: Request<{}, {}, ForgotPasswordRequestBody>, res: Response<ForgotPasswordResponse>) => {

        try {
            const { email} = req.body;
            const forgot = await forgotPassword(dependencies);
          
            const result = await forgot.executionFunction({email});

            if(result.status) {
                const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
                const token = jwt.sign (
                    {otp: result.otp, email},
                    SECRET_KEY,
                    {expiresIn: '10m'}
                )
                res.json({status: true, message: ResponseMessages.OTP_SENT_TO_MAIL, token});
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: result.data});
            }
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return forgotPasswordController;
}