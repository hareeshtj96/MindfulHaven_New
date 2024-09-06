import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default function therapistLogin (dependencies: any) {
    const { therapistRepository } = dependencies.repository;

    const therapistloginController = async (req: Request, res: Response) => {
        console.log("entered therapist login controller:")
        try {
            const { email, password, role } = req.body;
            console.log("req body:", req.body);


            // Find the therapist by email
            const therapist = await therapistRepository.getTherapistByEmail( email );
            console.log('therapist:', therapist );

            if (!therapist.status) {
                return res.status(400).json({ message: "Account not found" });
            }

            // Compare provided password with the stored hashed password
            const validPassword = await bcrypt.compare(password, therapist.user.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Invalid password" });
            }

            // Generate JWT token upon successful login
            const token = jwt.sign(
                { therapistId: therapist.user._id, email: therapist.user.email, name: therapist.user.name, role: therapist.user.role },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            // Send response
            res.json({ status: true, token });
        } catch (error) {
            console.error("Error in therapist loginController:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    return therapistloginController;
};
