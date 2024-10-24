import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import { sendVerificationEmail } from "../../../../utils/nodemailer";
import dotenv from 'dotenv';
dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {
    const { getVerifiedUsecase } = dependencies.useCase;

    const adminTherapistVerificationController = async (req:Request, res: Response) => {
        try {
            
            const therapistId = req.params.id;
            if(!therapistId) {
                return res.status(400).json({ status: false, message: ResponseMessages.THERAPIST_ID_REQUIRED })
            }

            console.log("Therapist ID:", therapistId);

            const response = await getVerifiedUsecase(dependencies).executeFunction(therapistId);

            if(response && response.status) {
                const therapist = response.data;
               
                const isVerified = therapist.isVerified;

                //send email notification
                const emailResponse = await sendVerificationEmail(
                    therapist.therapist.email,
                    therapist.therapist.name,
                    therapist.therapist.isVerified
                )
                console.log("emaill response:", emailResponse);
                if (!emailResponse.status) {
                    console.error("Failed to send email:", emailResponse.message)
                }
                
                return res.status(HttpStatusCode.OK).json({ status: true, data: response.data});
            } else {
                return res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: ResponseMessages.DATA_NOT_FOUND })
            }
        } catch (error) {
            console.error("Error in verify therapist:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return adminTherapistVerificationController;
}