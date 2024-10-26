import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { ResponseMessages } from "../../utils/httpStatusCode";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "undefined";

export default function userLogin(dependencies: any) {

    const {userRepository} = dependencies.repository;

    const executionFunction = async(data: any) => {
        try {
            const {email, password} = data;
         
            const user = await userRepository.getUserByEmail({email});
           
            if(!user.status) {
                return {status: false, data: ResponseMessages.INVALID_EMAIL_OR_PASSWORD };
            }
            
            //verify the password
            const isPasswordValid = await bcrypt.compare(password, user.data.password);
            if(!isPasswordValid) {
                return { status: false, data: ResponseMessages.INVALID_EMAIL_OR_PASSWORD }
            }

            const token = jwt.sign(
                {userData: {id: user.data.id, email: user.data.email}},
                SECRET_KEY,
                {expiresIn: "1h"}
            );
            return {status: true, token};
        } catch (error) {
            return {status: false, data: ResponseMessages.INTERNAL_SERVER_ERROR }
        }
    }
    return {
        executionFunction: executionFunction
    }
}