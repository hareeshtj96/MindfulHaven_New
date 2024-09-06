import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
        console.log("Entered forgot password controller");
        
        try {
            const { email} = req.body;
            const forgot = await forgotPassword(dependencies);
          
            console.log("request body:", req.body);

            const result = await forgot.executionFunction({email});

            console.log("result forgot controller:", result);

            if(result.status) {
                const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
                const token = jwt.sign (
                    {otp: result.otp, email},
                    SECRET_KEY,
                    {expiresIn: '10m'}
                )
                console.log("token from forgotpasswordcontoller:", token);

                res.json({status: true, message: "OTP sent to email", token});
            } else {
                res.status(400).json({ status: false, message: result.data});
            }
        } catch (error) {
            console.error("Error in forgot password controller:", error);
            res.status(500).json({ status: false, message: "internal Server Error"});
        }
    }
    return forgotPasswordController;
}