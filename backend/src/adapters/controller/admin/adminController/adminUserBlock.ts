import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { getuserBlockUsecase } = dependencies.useCase;

    const adminUserblockController = async (req:Request, res: Response) => {
        try {
            
            const userId = req.params.id;
            if(!userId) {
                return res.status(400).json({ status: false, message: "user ID is required"})
            }

            console.log("user ID:", userId);

            const response = await getuserBlockUsecase(dependencies).executeFunction(userId);

            if(response && response.status) {
                console.log("response form controller:", response)
                return res.status(200).json({ status: true, data: response.data});
            } else {
                return res.status(404).json({ status: false, message: "Data not found"})
            }
        } catch (error) {
            console.error("Error in block unblock user:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return adminUserblockController
}