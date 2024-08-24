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

export default function forgotPassword(dependencies: any) {

    const { userRepository } = dependencies.repository;

    const executionFunction =  async (data: ForgotPasswordData): Promise<ForgotPasswordResult> => {
        try {
            const { email, newPassword, confirmPassword } = data;
            console.log("Password reset attempt for email:", email);

            // Check if passwords match
            if (newPassword !== confirmPassword) {
                return { status: false, data: "Passwords do not match" };
            }

            // Find the user by email
            const user = await userRepository.getUserByEmail({ email });
            console.log("user found:", user);

            if (!user.status) {
                return { status: false, data: "User not found" };
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            console.log("hashed password:", hashedPassword);

            // Update the password in the database
            const updateResult = await userRepository.updateUserPassword({ email, hashedPassword });

            if (!updateResult.status) {
                return { status: false, data: "Failed to reset password" };
            }

            return { status: true, data: "Password reset successful" };
        } catch (error) {
            console.error("Error in forgot password use case:", error);
            return { status: false, data: "Internal Server Error" };
        }
    }

    return {
        executionFunction: executionFunction
    }
}
