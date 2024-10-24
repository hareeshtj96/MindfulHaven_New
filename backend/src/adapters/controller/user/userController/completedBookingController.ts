import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { getCompletedBookings } = dependencies.useCase;

    const completedBookingController = async (req: Request, res: Response ) => {

        console.log(" entered completed booking controller.........")
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            console.log("page from controller:", page)
            const limit = parseInt(req.query.limit as string, 10) || 2
            console.log("limit from controller:", limit)


            const authHeader = req.headers.authorization;
            console.log("authheader:", authHeader);

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.AUTHORIZATION_HEAD_MISSING });
            }

            const token = authHeader.split(' ')[1];
            console.log("token:", token);

            if (!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_MISSING });
            }

            // Verify and decode the token
            const decodedToken: any = jwt.verify(token, SECRET_KEY);
            console.log("decoded token:", decodedToken);
            const userId = decodedToken.userId;
            console.log("userId from decoded token:", userId);

            if (!userId) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.USER_ID_NOT_IN_TOKEN });
            }

           
            const response = await getCompletedBookings(dependencies).executeFunction({ userId, page, limit });
            console.log(" response from view controller:", response);

            if( response && response.status) {
                console.log("response from controller:", response);
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in  completed bookin controller:", error);
            return res.status(HttpStatusCode.UNAUTHORIZED).json({status: false, message: ResponseMessages.TOKEN_EXPIRED });
        }
    }
    return completedBookingController;
}