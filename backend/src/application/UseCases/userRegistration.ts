import jwt from "jsonwebtoken";
import { SendOtp } from "../../utils";
import dotenv from 'dotenv';
dotenv.config();


const SECRET_KEY = process.env.JWT_SECRET || 'undefined';

export default function userRegistration(dependencies: any) {

    const {userRepository} = dependencies.repository;

    const executionFunction = async (data: any) => {
        try {
            const {email, role,password} = data;
            console.log("email:", email);
            console.log("password from register use case :", password)

            const userExists = await userRepository.getUserByEmail({email});
            console.log("userExists:", userExists);
            if (userExists.status) {
                console.log("user already exists error triggered:");
                return { status: false, data: "User already exists"};
            }


            const response = await SendOtp(email);
            console.log("response otp:", response);
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
            console.error('Error in user registration use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    }
    return {
        executionFunction: executionFunction
    };
}