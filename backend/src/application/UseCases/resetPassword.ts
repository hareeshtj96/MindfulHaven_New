import { ResponseMessages } from "../../utils/httpStatusCode";
import bcrypt from "bcryptjs";

interface ForgotPasswordData {
    email: string;
    newPassword: string;
    confirmPassword: string;
}

interface ForgotPasswordResult {
    status: boolean;
    data: string;
}

const SALT_ROUNDS = 10;

export default function resetPassword(dependencies: any) {

    const { userRepository } = dependencies.repository;

    const executionFunction =  async (data: ForgotPasswordData): Promise<ForgotPasswordResult> => {
        try {
            const { email, newPassword, confirmPassword} = data;
  

            // Check if passwords match
            if (newPassword !== confirmPassword) {
                return { status: false, data: ResponseMessages.PASSWORD_DO_NOT_MATCH };
            }


            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            console.log("hashed password:", hashedPassword);

            // Update the password in the database
            const updateResult = await userRepository.updateUserPassword({ email, hashedPassword });

            if (!updateResult.status) {
                return { status: false, data: ResponseMessages.FAILED_TO_RESET_PASSWORD };
            }

            return { status: true, data: ResponseMessages.PASSWORD_RESET_SUCCESSFULLY };
        } catch (error) {
            console.error("Error in forgot password use case:", error);
            return { status: false, data: ResponseMessages.INTERNAL_SERVER_ERROR };
        }
    }

    return {
        executionFunction: executionFunction
    }
}

