import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
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
                return res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: ResponseMessages.USER_ID_REQUIRED })
            }

            const response = await getuserBlockUsecase(dependencies).executeFunction(userId);
          
            if(response && response.status) {
                return res.status(HttpStatusCode.OK).json({ status: true, data: response.data});
            } else {
                return res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return adminUserblockController
}