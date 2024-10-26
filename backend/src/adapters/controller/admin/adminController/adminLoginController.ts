import { Request, Response } from "express";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export default (dependencies: any) => {

    const adminLoginController = async(req: Request, res: Response) => {
        try {
            const { email, password, role } = req.body;
            const { adminLogin } = dependencies.useCase;

            const data = { email, password, role };
            
            const execute = await adminLogin(dependencies);
            const response = await execute.executeFunction(data);


            if (response.status) {
                const admin = response.user;

                // Password should be compared here if not hashed
                if (admin.password === password) {
                    const token = jwt.sign(
                        { id: admin._id, email: admin.email, role: admin.role },
                        SECRET_KEY,
                        { expiresIn: "1h" }
                    );

                    res.json({ status: true, token: token, admin: { id: admin._id, email: admin.email, name: admin.name } });
                } else {
                    res.json({ status: false, message: ResponseMessages.INVALID_CREDENTIALS });
                }
            } else {
                res.json({ status: false, message: response.message });
            }

        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    }
    return adminLoginController;
}
