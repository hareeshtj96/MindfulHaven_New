import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const resetPasswordOtpcontroller = async(req: Request, res: Response) => {

        try {
            const { otp } = req.body;
          
            const authHeader = req.headers.authorization;
            
            const token = authHeader?.split(" ")[1];
        

            if(!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_MISSING })
            }

            let decoded: any;
            try {
                decoded = jwt.verify(token, SECRET_KEY)  as jwt.JwtPayload;
            } catch (error) {
                return res.status(401).json({ status: false, message: ResponseMessages.TOKEN_EXPIRED })
            }

            if(decoded.otp === otp) {
                const email = decoded.email
                res.json({ status: true, message: ResponseMessages.OTP_VERIFIED_YOU_CAN_RESET_PASSWORD, email}); 
            } else {
                
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false ,message: ResponseMessages.INCORRECT_OTP })
            }
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return resetPasswordOtpcontroller;
}