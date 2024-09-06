import { Request, Response } from "express";
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
            console.log('controller');

            const { name, email, password, mobile, role } = req.body;
            console.log("req.body:", req.body);

            const userData: UserData = { name, email, password, mobile, role };

            // Invoke the registration use case
            const registrationFunction = await userRegistration(dependencies);
            const response: RegistrationResponse = await registrationFunction.executionFunction(userData);

            console.log("response in registration controller:", response);

            if (response.status) {
                const encodedToken = response.token as string;

                console.log("encoded token:", encodedToken);

                // Verify and decode the token
                const decodedToken = jwt.verify(encodedToken, SECRET_KEY) as jwt.JwtPayload;

                console.log("Decoded token:", decodedToken);

                // Generate a new token
                const token = jwt.sign(
                    { otp: decodedToken.otp, userData: {name, email, role} }, 
                    SECRET_KEY, 
                    { expiresIn: '10m' }
                );

                res.json({ status: true, token });
            } else {
                res.status(400).json({ status: false, data: response.data });
            }
        } catch (error) {
            console.error('Error in registration:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    return registerController;
};
