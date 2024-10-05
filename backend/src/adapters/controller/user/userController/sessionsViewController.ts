import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
console.log("secret key:", SECRET_KEY);


export default (dependencies: any) => {
    const { getAllBookings } = dependencies.useCase;

    const sessionsViewController = async (req: Request, res: Response ) => {

        console.log(" entered sessions view controller.........")
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            console.log("page from controller:", page)
            const limit = parseInt(req.query.limit as string, 10) || 2
            console.log("limit from controller:", limit)


            const authHeader = req.headers.authorization;
            console.log("authheader:", authHeader);

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ status: false, message: "Authorization header is missing or invalid" });
            }

            console.log("secret key:", SECRET_KEY);

            const token = authHeader.split(' ')[1];
            console.log("token:", token);

            if (!token) {
                return res.status(401).json({ status: false, message: "Token is missing" });
            }

            // Verify and decode the token
            const decodedToken: any = jwt.verify(token, SECRET_KEY);
            console.log("decoded token:", decodedToken);
            const email = decodedToken.email;
            console.log("email from decoded token:", email);

            if (!email) {
                return res.status(400).json({ status: false, message: "Email not found in the token" });
            }

           
            const response = await getAllBookings(dependencies).executeFunction({ email, page, limit });
            console.log(" response from view controller:", response);

            if( response && response.status) {
                console.log("response from controller:", response);
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message ||"Data not found" })
            }
        } catch (error) {
            console.error("Error in  sessions view controller:", error);
            return res.status(401).json({status: false, message: "Token expired"});
        }
    }
    return sessionsViewController;
}