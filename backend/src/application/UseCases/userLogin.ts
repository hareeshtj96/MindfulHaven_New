import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "undefined";

export default function userLogin(dependencies: any) {

    const {userRepository} = dependencies.repository;

    const executionFunction = async(data: any) => {
        try {
            const {email, password} = data;
            console.log("Login attempt with email:", email);

            const user = await userRepository.getUserByEmail({email});
            console.log("user found:", user);

            if(!user.status) {
                return {status: false, data: "Invalid email or password"};
            }
            
            //verify the password
            const isPasswordValid = await bcrypt.compare(password, user.data.password);
            if(!isPasswordValid) {
                return { status: false, data: "Invalid email or password"}
            }

            const token = jwt.sign(
                {userData: {id: user.data.id, email: user.data.email}},
                SECRET_KEY,
                {expiresIn: "1h"}
            );
            return {status: true, token};
        } catch (error) {
            console.error("Error in user login use case:", error);
            return {status: false, data: "Internal Server Error"}
        }
    }
    return {
        executionFunction: executionFunction
    }
}