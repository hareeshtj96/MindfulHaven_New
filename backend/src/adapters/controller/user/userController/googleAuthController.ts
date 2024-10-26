import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


dotenv.config();

interface UserData {
    name: string;
    email: string;
    role: string;
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
            const { name, email, role} = req.body;
            
            const userData: UserData = { name, email, role };

            // check if user already exists (login use case)
            const loginFunction = await userLoginGoogle(dependencies);
            const loginResponse: RegistrationResponse = await loginFunction.executionFunction(userData);

            if (loginResponse.status) {
                res.json({ status: true, token: loginResponse.token, redirect: "dashboard" });
                return;
            }

            // Invoke the registration use case
            const registrationFunction = await userRegistrationGoogle(dependencies);
            const response: RegistrationResponse = await registrationFunction.executionFunction(userData);

            if (response.status) {
                const token = jwt.sign(
                    {name: userData.name, email: userData.email, role: userData.role},
                    SECRET_KEY,
                    {expiresIn: "1h"}
                )

                res.json({ status: true, token});
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, data: response.data });
            }
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    };

    return googleAuthController;
};
