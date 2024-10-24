import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { getUserProfileUsecase } = dependencies.useCase;

    const userProfileController = async (req: Request, res: Response) => {
        console.log("entered user profile..........");
        try {
            const authHeader = req.headers.authorization;
            console.log("authheader:", authHeader);

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.AUTHORIZATION_HEAD_MISSING });
            }

            // Extract token from 'Bearer <token>' format
            const token = authHeader.split(' ')[1];
            console.log("token:", token);

            if (!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_MISSING });
            }

            // Verify and decode the token
            const decodedToken: any = jwt.verify(token, SECRET_KEY);
            console.log("decoded token:", decodedToken);
            const email = decodedToken.email;
            console.log("email from decoded token:", email);

            if (!email) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.EMAIL_NOT_FOUND_IN_TOKEN });
            }

            const response = await getUserProfileUsecase(dependencies).executeFunction({ email });
           
            if (response && response.status) {
                console.log("response from controller:", response);
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.DATA_NOT_FOUND });
            }
        } catch (error) {
            console.error("Error in get user profile:", error);
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: ResponseMessages.TOKEN_EXPIRED });
        }
    }
    return userProfileController;
}
