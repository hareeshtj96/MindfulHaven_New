import { Request, Response } from "express";


export default (dependencies: any) => {
    const { getSlotsUsecase } = dependencies.useCase;

    const slotManagementController = async (req: Request, res: Response ) => {

        console.log(" entered slot management controller.........")
        try {
            const { id } = req.params;
            console.log("id from params:", id);

            const response = await getSlotsUsecase(dependencies).executeFunction(id);

            if( response && response.status) {
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message  })
            }
        } catch (error) {
            console.error("Error in  slot management controller:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return slotManagementController;
}