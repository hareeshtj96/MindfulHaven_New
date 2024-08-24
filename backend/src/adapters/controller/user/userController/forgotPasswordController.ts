import { Request, Response } from "express";


interface ForgotPasswordRequestBody {
    email: string;
    newPassword: string;
    confirmPassword: string;
}

interface ForgotPasswordResponse {
    status: boolean;
    message: string;
}

export default function forgotPassword(dependencies: any) {
    const { forgotPassword } = dependencies.useCase;
    
    const forgotPasswordController = async (req: Request<{}, {}, ForgotPasswordRequestBody>, res: Response<ForgotPasswordResponse>) => {
        console.log("Entered forgot password controller");
        
        try {
            const { email, newPassword, confirmPassword } = req.body;
            const forgot = await forgotPassword(dependencies)
            console.log("request body:", req.body);

            if(newPassword !== confirmPassword) {
                return res.status(400).json({ status: false, message: "Passwords do not match"});
            }

            const result = await forgot.executionFunction({email, newPassword, confirmPassword});

            if(result.status) {
                res.json({status: true, message: result.data});
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