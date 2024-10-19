
export default (dependencies: any) => {
    const { userRepository } = dependencies.repository;

    const executeFunction = async (requestData: { email: string, currentPassword: string, newPassword: string, confirmPassword: string }) => {
        console.log("entered use case:.....")
        try {
            const {email, currentPassword, newPassword, confirmPassword} = requestData;
            const response = await userRepository.changePassword({email, currentPassword, newPassword, confirmPassword});
            console.log("response from use case:", response);
            
            if(response && response.status) {
                return { status: true, message: "Password updated successfully"};
            } else  {
                return { status: false, message: response.message || "Failed to change password"}
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in change password useCase"};
        }
    }
    return {executeFunction}
}