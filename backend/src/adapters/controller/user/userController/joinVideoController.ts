import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import dependencies from "../../../../frameworks/config/dependencies";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { generateZegoToken } from "../../../../utils/generateZegoToken";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";



export default (dependencies: any) => {
    const { joinVideoSessionUsecase } = dependencies.useCase;

    const joinVideoController = async (req: Request, res:Response) => {
        console.log("entered join video session....");

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
            console.log("decoded token:", decodedToken);
            
            const userId = decodedToken.userId;

           
            const { bookingId} = req.body;
            console.log("request body....", req.body);

            if (!bookingId) {
                return res.status(400).json({ status: false, message: "Booking ID is required"})
            }

            
            
            const response = await joinVideoSessionUsecase(dependencies).executeFunction({userId, bookingId});

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
    return joinVideoController;
}