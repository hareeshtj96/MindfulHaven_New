import { Request, Response } from "express";
import jwt from "jsonwebtoken";
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
                return res.status(400).json({ status: false, message: "Therapist ID is required"})
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
                
                return res.status(200).json({ status: true, data: response.data});
            } else {
                return res.status(404).json({ status: false, message: "Data not found"})
            }
        } catch (error) {
            console.error("Error in verify therapist:", error);
            return res.status(500).json({status: false, message: "Internal Server Error"});
        }
    }
    return adminTherapistVerificationController;
}