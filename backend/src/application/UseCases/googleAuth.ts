import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import { ResponseMessages } from "../../utils/httpStatusCode";

const SECRET_KEY = process.env.JWT_SECRET || 'undefined';

export default function userRegistrationGoogle(dependencies: any) {

    const {userRepository} = dependencies.repository;

    const executionFunction = async (data: any) => {
        try {
            const {email} = data;
            console.log("email:", email);

            const userExists = await userRepository.getUserByEmail({email});
            console.log("userExists:", userExists);
            if (userExists.status) {
                console.log("user already exists error triggered:");
                return { status: false, data: ResponseMessages.USER_ALREADY_EXISTS };
            }

            const response = await userRepository.createUser(data);
            console.log("response from userRepository:", response);

            if(response.status) {
                const token = jwt.sign (
                    {userData: data},
                    SECRET_KEY,
                    {expiresIn: '10m'}
                );
                return { status: true, token};
            } else {
                return { status: false, data: response.message}
            }
            
        } catch (error) {
            console.error('Error in user registration use case:', error);
            return { status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR };
        }
    }
    return {
        executionFunction: executionFunction
    };
}