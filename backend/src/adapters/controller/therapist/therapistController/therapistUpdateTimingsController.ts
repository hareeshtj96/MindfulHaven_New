import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dependencies from "../../../../frameworks/config/dependencies";
import dotenv from 'dotenv'
import { start } from "repl";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { updateTherapistTimingsUsecase } = dependencies.useCase;

    const therapistUpdateTimingsController = async (req: Request, res: Response) => {
        console.log("Entered therapist update timinfs controller");

        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ status: false, message: "Unauthorized"});
            
            }

            const decodedToken = jwt.verify(token, SECRET_KEY ) as JwtPayload
            console.log("decoded token....", decodedToken);
            const email = decodedToken.email
            console.log("email decoded....", email);

            const { startTime, endTime, date } = req.body;
            console.log("request body:", req.body);
            
            const response = await updateTherapistTimingsUsecase(dependencies).executeFunction({email, startTime, endTime, date});
            console.log("response from controller:", response);

            if (response && response.status) {
                res.status(200).json({ status: true, data: response.data })
            } else {
                res.status(400).json({ status: false, message: response.message});
            }
        } catch (error) {
            console.error("Error in therapist update timings controller:", error);
            return res.status(401).json({ status: false, message:"Token expired Error"});
        }
        
    };
    return therapistUpdateTimingsController;
}