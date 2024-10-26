import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

interface UserData {
    name: string;
    email: string;
    password: string;
    mobile: string;
    role: string;
}


interface RegistrationResponse {
    status: boolean;
    token?: string;
    data?: any; 
}

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { userRegistration } = dependencies.useCase;

    const registerController = async (req: Request, res: Response) => {
        try {
            const { name, email, password, mobile, role } = req.body;
            
            const userData: UserData = { name, email, password, mobile, role };

            // Invoke the registration use case
            const registrationFunction = await userRegistration(dependencies);
            const response: RegistrationResponse = await registrationFunction.executionFunction(userData);

            if (response.status) {
                const encodedToken = response.token as string;

                // Verify and decode the token
                const decodedToken = jwt.verify(encodedToken, SECRET_KEY) as jwt.JwtPayload;

                // Generate a new token
                const token = jwt.sign(
                    { otp: decodedToken.otp, userData: {name, email, role, password, mobile} }, 
                    SECRET_KEY, 
                    { expiresIn: '10m' }
                );

                res.json({ status: true, token });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, data: response.data });
            }
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    };

    return registerController;
};
