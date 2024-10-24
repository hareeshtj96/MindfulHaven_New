import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";


export default (dependencies: any) => {
    const { getSlotsUsecase } = dependencies.useCase;

    const slotManagementController = async (req: Request, res: Response ) => {

        console.log(" entered slot management controller.........")
        try {
            const { id } = req.params;
            console.log("id from params:", id);

            const response = await getSlotsUsecase(dependencies).executeFunction(id);

            if( response && response.status) {
                res.status(HttpStatusCode.OK).json({ status: true, data: response.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: response.message  })
            }
        } catch (error) {
            console.error("Error in  slot management controller:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return slotManagementController;
}