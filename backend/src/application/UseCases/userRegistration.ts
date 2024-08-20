import { SendOtp } from "../../utils";

export default function userRegistration(dependencies: any) {

    const {userRepository} = dependencies.repository;

    const executionFunction = async (data: any) => {
        try {
            const {email} = data;

            const userExists = await userRepository.getUserByEmail({email});

            if (userExists.status) {
                return { status: false, data: "User already exists"};
            }

            const response = await SendOtp(email);
            if(response.status) {
                return {status: true, data: response.otp};
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