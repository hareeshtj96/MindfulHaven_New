import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";

export default (dependencies: any) => {
    const { getTherapistProfileUsecase } = dependencies.useCase;

    const getTherapistProfileController = async (req: Request, res: Response ) => {
        try {
            const response = await getTherapistProfileUsecase(dependencies).executeFunction();

            if( response && response.status) {
                console.log("resppinse from controller:", response);
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(404).json({ status: false, message: "Data not found" })
            }
        } catch (error) {
            console.error("Error in  get therapist profile:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return getTherapistProfileController;
}