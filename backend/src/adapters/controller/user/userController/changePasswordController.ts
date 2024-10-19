import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";


export default (dependencies: any) => {
    const { changePasswordUsecase } = dependencies.useCase;

    const changePasswordController = async (req: Request, res: Response) => {
        console.log("Entered change password controller");

        try {
            const { email, currentPassword, newPassword, confirmPassword } = req.body;
            console.log("Password details received from request body:", { email, currentPassword, newPassword, confirmPassword });
            

            const response = await changePasswordUsecase(dependencies).executeFunction({email ,currentPassword, newPassword, confirmPassword})
            console.log("response from change password controller:", response);

            if (response && response.status) {
                return res.status(200).json({ status: true, message: "Password changed successfully"})
            } else {
                return res.status(400).json({ status: false, message: response.message || "Failed to change password"})
            }
        } catch (error) {
            console.error("Error in change password controller:", error);
            return res.status(500).json({ status: false, message: "internal server Error"});
        }
        
    }
    return changePasswordController;
}