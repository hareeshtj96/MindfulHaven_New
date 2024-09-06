import jwt from "jsonwebtoken";
import { SendOtp } from "../../utils";
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'undefined';

export default function forgotPassword(dependencies: any) {

    const {userRepository} = dependencies.repository;

    const execute = async (data: any) => {
        try {
            const {email} = data;
            console.log("email:", email);

            const userExists = await userRepository.getUserByEmail({email});
            console.log("userExists:", userExists);
            if (!userExists.status) {
                console.log("user not found:");
                return { status: false, data: "User not found"};
            }


            const response = await SendOtp(email);
            console.log("response otp:", response);
            if(response.status) {
                
                return {status: true, otp: response.otp};
            } else {
                return {status: false, data: response.message}
            }
        } catch (error) {
            console.error('Error in user registration use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    }
    return {
        executionFunction: execute
    };
}