import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default function userLogin (dependencies: any) {
    const { userRepository } = dependencies.repository;

    const loginController = async (req: Request, res: Response) => {
        console.log("entered login controller:")
        try {
            const { email, password } = req.body;
            console.log("req body:", req.body);


            // Find the user by email
            const user = await userRepository.getUserByEmail({ email });
            console.log('user:', user);

            if (!user.status) {
                return res.status(400).json({ message: "User not found" });
            }

            // Compare provided password with the stored hashed password
            const validPassword = await bcrypt.compare(password, user.data.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Invalid password" });
            }

            // Generate JWT token upon successful login
            const token = jwt.sign(
                { userId: user.data._id, email: user.data.email, name: user.data.name },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            // Send response
            res.json({ status: true, token });
        } catch (error) {
            console.error("Error in loginController:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    return loginController;
};
