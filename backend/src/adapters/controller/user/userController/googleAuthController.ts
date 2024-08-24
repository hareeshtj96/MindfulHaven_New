import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config();

interface UserData {
    name: string;
    email: string;
}

interface RegistrationResponse {
    status: boolean;
    token?: string;
    data?: any; 
}

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { userRegistrationGoogle, userLoginGoogle } = dependencies.useCase;

    const googleAuthController = async (req: Request, res: Response) => {
        try {
            console.log(' entered google auth controller');

            const { name, email} = req.body;
            console.log("req.body:", req.body);

            const userData: UserData = { name, email };

            // check if user already exists (login use case)
            const loginFunction = await userLoginGoogle(dependencies);
            const loginResponse: RegistrationResponse = await loginFunction.executionFunction(userData);

            if (loginResponse.status) {
                console.log("User exists, returning token:", loginResponse.token);
                res.json({ status: true, token: loginResponse.token, redirect: "dashboard" });
                return;
            }


            // Invoke the registration use case
            const registrationFunction = await userRegistrationGoogle(dependencies);
            const response: RegistrationResponse = await registrationFunction.executionFunction(userData);

           

            console.log("response in registration controller:", response);

            if (response.status) {
                const token = jwt.sign(
                    {name: userData.name, email: userData.email},
                    SECRET_KEY,
                    {expiresIn: "1h"}
                )

                console.log("encoded token:", token);

                res.json({ status: true, token});
            } else {
                res.status(400).json({ status: false, data: response.data });
            }
        } catch (error) {
            console.error('Error in registration:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    return googleAuthController;
};
