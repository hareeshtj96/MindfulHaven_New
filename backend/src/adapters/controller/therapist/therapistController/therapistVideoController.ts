import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";



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
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.AUTHORIZATION_HEAD_MISSING })
            }

            const token = authHeader.split(' ')[1];
            console.log("token:", token);

            if (!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_MISSING });

            }

            const decodedToken: any = jwt.verify(token, SECRET_KEY);
            console.log("decoded token.. ..  ....:", decodedToken);
            
            const therapistId = decodedToken.therapistId;

           
            const { bookingId} = req.body;
            console.log("request body....", req.body);

            if (!bookingId) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.BOOKING_ID_REQUIRED })
            }

            
            
            const response = await therapistSessionUsecase(dependencies).executeFunction({therapistId, bookingId});
            console.log("Response from controller:...", response);

            if (response && response.status) {
                console.log("response from controller:", response);
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data});
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.UNABLE_TO_JOIN_VIDEO })
            }
            
        } catch (error) {
            console.error("Error in join video session:", error);
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_EXPIRED })
        }
        
    }
    return therapistVideoController;
}