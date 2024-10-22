import { Request, Response } from "express";
import dependencies from "../../../../frameworks/config/dependencies";

export default (dependencies: any) => {
    const { getTherapistDetailsUsecase } = dependencies.useCase;

    const getAvailableDetailsController = async (req: Request, res: Response ) => {
        console.log(" entered avaialble dates controller..")
        try {
            const { therapistId } = req.query;

            console.log("therapist id from req body:", therapistId);

            const response = await getTherapistDetailsUsecase(dependencies).executeFunction(therapistId);
            console.log("response from get details controller:", response);

            if( response && response.status) {
                console.log("response from controller:", response);
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(404).json({ status: false, message: "Data not found" })
            }
        } catch (error) {
            console.error("Error in  get therapist details:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return getAvailableDetailsController;
}