import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

interface TherapistData {
    name: string;
    email: string;
    password: string;
   
}

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { therapistRegistration } = dependencies.useCase;

    const registerController = async (req: Request, res: Response) => {
        console.log("entered register control ..............");
        try {
            const { name, email, password } = req.body;
            console.log("req.body:", req.body);

            const data = { name, email, password };

            const response = await therapistRegistration(dependencies);

            console.log("response from register controller");

            const execute = await response.executionFunction(data);
            console.log('execute:', execute);

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
                res.status(400).json({ status: false, data: execute.data });
            }
        } catch (error) {
            console.error('Error in therapist registration:',  error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    return registerController;
};
