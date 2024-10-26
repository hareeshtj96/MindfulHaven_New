import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

interface TherapistData {
    name: string;
    email: string;
    password: string;
    role: string;
   
}

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { therapistRegistration } = dependencies.useCase;

    const registerController = async (req: Request, res: Response) => {
        try {
            const { name, email, password, role } = req.body;
            
            const data = { name, email, password, role };

            const response = await therapistRegistration(dependencies);

            const execute = await response.executionFunction(data);
            
            if (execute.status) {
                const encodedToken = execute.token as string;

                if (!encodedToken) {
                    throw new Error("JWT token was not provided by therapistRegistration");
                }

                if (jwt.verify(encodedToken, SECRET_KEY)) {
                    const decodedToken = jwt.decode(encodedToken) as jwt.JwtPayload;
                    const newToken = jwt.sign(
                      { otp: decodedToken.otp, TherapistData: decodedToken.TherapistData },
                      SECRET_KEY,
                      { expiresIn: '10d' }
                    );
                    res.json({ status: true, token: newToken });
                  }

            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, data: execute.data });
            }
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    };

    return registerController;
};
