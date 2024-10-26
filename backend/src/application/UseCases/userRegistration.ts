import jwt from "jsonwebtoken";
import { SendOtp } from "../../utils";
import dotenv from 'dotenv';
import { ResponseMessages } from "../../utils/httpStatusCode";
dotenv.config();


const SECRET_KEY = process.env.JWT_SECRET || 'undefined';

export default function userRegistration(dependencies: any) {

    const {userRepository} = dependencies.repository;

    const executionFunction = async (data: any) => {
        try {
            const {email, role,password} = data;
            
            const userExists = await userRepository.getUserByEmail({email});
           
            if (userExists.status) {
                return { status: false, data: ResponseMessages.USER_ALREADY_EXISTS };
            }

            const response = await SendOtp(email);
            if(response.status) {
                const token = jwt.sign(
                    {otp: response.otp, userData:data},
                    SECRET_KEY,
                    {expiresIn: "10m"}
                );

                return {status: true, token};
            } else {
                return {status: false, data: response.message}
            }
        } catch (error) {
            return { status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR };
        }
    }
    return {
        executionFunction: executionFunction
    };
}