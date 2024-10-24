import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


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
                return res.status(HttpStatusCode.OK).json({ status: true, message: ResponseMessages.PASSWORD_CHANGED_SUCCESSFULLY })
            } else {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message || ResponseMessages.FAILED_TO_CHANGE_PASSWORD })
            }
        } catch (error) {
            console.error("Error in change password controller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
        
    }
    return changePasswordController;
}