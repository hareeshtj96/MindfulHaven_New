import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default function therapistLogin (dependencies: any) {
    const { therapistRepository } = dependencies.repository;

    const therapistloginController = async (req: Request, res: Response) => {
        try {
            const { email, password, role } = req.body;
           
            // Find the therapist by email
            const therapist = await therapistRepository.getTherapistByEmail( email );
        
            if (!therapist.status) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: ResponseMessages.ACCOUNT_NOT_FOUND });
            }

            // Compare provided password with the stored hashed password
            const validPassword = await bcrypt.compare(password, therapist.user.password);
            if (!validPassword) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: ResponseMessages.INVALID_PASSWORD });
            }

            // Generate JWT token upon successful login
            const token = jwt.sign(
                { therapistId: therapist.user._id, email: therapist.user.email, name: therapist.user.name, role: therapist.user.role },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            // Exclude the password from the response
            const therapistDetails = {
                therapistId: therapist.user._id,
                name: therapist.user.name,
                email: therapist.user.email,
                phone: therapist.user.phone,
                specialization: therapist.user.specialization,
                gender: therapist.user.gender,
                educationalQualifications: therapist.user.educationalQualifications,
                identityProof: therapist.user.identityProof,
                counsellingQualification: therapist.user.counsellingQualification,
                professionalExperience: therapist.user.professionalExperience,
                establishment: therapist.user.establishment,
                location: therapist.user.location,
                timings: therapist.user.timings,
                fees: therapist.user.fees,
                photo: therapist.user.photo,
                role: therapist.user.role
            };

            // Send response
            res.json({ status: true, token, therapist: therapistDetails });
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    };

    return therapistloginController;
};
