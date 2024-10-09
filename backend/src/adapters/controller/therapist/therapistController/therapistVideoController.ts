import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";



export default (dependencies: any) => {
    const { therapistSessionUsecase } = dependencies.useCase;

    const therapistVideoController = async (req: Request, res:Response) => {
        console.log("entered therapist join video session....");

        try {
            const authHeader = req.headers.authorization;
            console.log("authHeader:", authHeader);

            if (!authHeader || !authHeader.startsWith('Bearer')) {
                return res.status(401).json({ status: false, message: "Authorization header is missing or invalid"})
            }

            const token = authHeader.split(' ')[1];
            console.log("token:", token);

            if (!token) {
                return res.status(401).json({ status: false, message: "Token is missing"});

            }

            const decodedToken: any = jwt.verify(token, SECRET_KEY);
            console.log("decoded token.. ..  ....:", decodedToken);
            
            const therapistId = decodedToken.therapistId;

           
            const { bookingId} = req.body;
            console.log("request body....", req.body);

            if (!bookingId) {
                return res.status(400).json({ status: false, message: "Booking ID is required"})
            }

            
            
            const response = await therapistSessionUsecase(dependencies).executeFunction({therapistId, bookingId});
            console.log("Response from controller:...", response);

            if (response && response.status) {
                console.log("response from controller:", response);
                res.status(200).json({ status: true, data: response.data});
            } else {
                res.status(404).json({ status: false, message: "Unable to join video session"})
            }
            
        } catch (error) {
            console.error("Error in join video session:", error);
            return res.status(401).json({ status: false, message: "Token expired or invalid "})
        }
        
    }
    return therapistVideoController;
}