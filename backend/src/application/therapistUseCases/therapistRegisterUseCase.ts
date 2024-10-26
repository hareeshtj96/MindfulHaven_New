import jwt from "jsonwebtoken";
import { SendOtp } from "../../utils";
import dotenv from 'dotenv';
dotenv.config();
import { HttpStatusCode, ResponseMessages } from "../../utils/httpStatusCode";

const SECRET_KEY = process.env.JWT_SECRET || 'undefined';

export default function therapistRegistration(dependencies: any) {

    const {therapistRepository} = dependencies.repository;

    const executionFunction = async (data: any) => {
        try {
            const {name, email, password} = data;
           
            const therapistExists = await therapistRepository.getTherapistByEmail(email);
           
            if (therapistExists.status) {
                return { status: false, data: ResponseMessages.THERAPIST_ALREADY_EXISTS};
            }

            const response = await SendOtp(email);
           
            if(response.status) {

                const token = jwt.sign(
                    {otp: response.otp, TherapistData:data},
                    SECRET_KEY,
                    {expiresIn: "10d"}
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