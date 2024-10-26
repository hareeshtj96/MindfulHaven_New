import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import { ResponseMessages } from "../../utils/httpStatusCode";

const SECRET_KEY = process.env.JWT_SECRET || 'undefined';

export default function userLoginGoogle(dependencies: any) {

    const {userRepository} = dependencies.repository;

    const executionFunction = async (data: any) => {
        try {
            const {email} = data;
            
            const userExists = await userRepository.getUserByEmail({email});
            
            if (userExists.status) {
                const token = jwt.sign(
                    {name:userExists.data.name, email: userExists.data.email},
                    SECRET_KEY,
                    {expiresIn: '1h'}
                );
                return {status: true, token};
                
            }

            const response = await userRepository.createUser(data);
            
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
            return { status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR };
        }
    }
    return {
        executionFunction: executionFunction
    };
}