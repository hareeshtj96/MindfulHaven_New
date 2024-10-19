import { Request, Response } from "express";


export default (dependencies: any) => {
    const { walletDetailsUsecase } = dependencies.useCase;

    const walletDetailsController = async (req: Request, res: Response ) => {

        console.log(" entered wallet details controller.........")
        try {
            const { userId } = req.query
            console.log("req query....", req.query);
           
            const response = await walletDetailsUsecase(dependencies).executeFunction({ userId});

            if( response && response.status) {
                console.log("response from wallet details controller:", response);
                res.status(200).json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message ||"Data not found" })
            }
        } catch (error) {
            console.error("Error in wallet details controller:", error);
            return res.status(401).json({status: false, message: "Token expired"});
        }
    }
    return  walletDetailsController;
}