import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {

    const adminLoginController = async(req: Request, res: Response) => {
        try {
            const { email, password, role } = req.body;
            const { adminLogin } = dependencies.useCase;

            const data = { email, password, role };
            console.log("data from admin controller:", data);

            const execute = await adminLogin(dependencies);
            const response = await execute.executeFunction(data);

            console.log("response:", response);

            if (response.status) {
                const admin = response.user;

                // Password should be compared here if not hashed
                if (admin.password === password) {
                    const token = jwt.sign(
                        { id: admin._id, email: admin.email, role: admin.role },
                        SECRET_KEY,
                        { expiresIn: "1h" }
                    );

                    console.log("token created from controller:", token);
                    res.json({ status: true, token: token, admin: { id: admin._id, email: admin.email, name: admin.name } });
                } else {
                    res.json({ status: false, message: "Invalid credentials" });
                }
            } else {
                res.json({ status: false, message: response.message });
            }

        } catch (error) {
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    }
    return adminLoginController;
}
