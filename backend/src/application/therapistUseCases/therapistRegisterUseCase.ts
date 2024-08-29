import jwt from "jsonwebtoken";
import { SendOtp } from "../../utils";
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'undefined';

export default function therapistRegistration(dependencies: any) {

    const {therapistRepository} = dependencies.repository;

    const executionFunction = async (data: any) => {
        try {
            const {name, email, password} = data;
            console.log("email:", email);
            console.log("name:", name)
            console.log("password:", password);

            const therapistExists = await therapistRepository.getTherapistByEmail(email);
            console.log("Exists:", therapistExists);
            if (therapistExists.status) {
                console.log("therapist already exists error triggered:");
                return { status: false, data: "therapist already exists"};
            }


            const response = await SendOtp(email);
            console.log("response otp:", response);
            if(response.status) {

                const token = jwt.sign(
                    {otp: response.otp, TherapistData:data},
                    SECRET_KEY,
                    {expiresIn: "10d"}
                );
                console.log("Generated token:", token);
                return {status: true, token};
            } else {
                return {status: false, data: response.message}
            }
        } catch (error) {
            console.error('Error in therapist registration use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    }
    return {
        executionFunction: executionFunction
    };
}