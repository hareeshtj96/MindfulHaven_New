import { Request, Response } from "express";


export default (dependencies: any) => {
    const { getBookedSlotsUsecase } = dependencies.useCase;

    const appointmentBookedController = async (req: Request, res: Response ) => {

        console.log(" entered appointment booked controller.........")
        try {
            const { id } = req.params;
            console.log("id from params:", id);

            const response = await getBookedSlotsUsecase(dependencies).executeFunction(id);
            console.log("response from controller:", response);

            if( response && response.status) {
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message  })
            }
        } catch (error) {
            console.error("Error in  appointment booked controller:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return appointmentBookedController;
}