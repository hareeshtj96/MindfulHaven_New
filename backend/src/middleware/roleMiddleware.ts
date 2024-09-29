import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const roleMiddleware = (allowedRoles: string[]) => {
    return (req:Request, res:Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if(!authHeader) {
                return res.status(401).json({ message: 'Authorization header missing'})
            }
            const token = authHeader.split(' ')[1];
            const decodedToken = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
            console.log("decoded Token:", decodedToken);

            const role = decodedToken?.userData?.role;
            console.log("role from rolemiddleware:", role);
            if(!role || !allowedRoles.includes(role)) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions'})
            }
            next();
        } catch (error) {
            console.error('Role-based access error:', error);
            res.status(401).json({ message: 'Invalid token or unauthorized access'});
        }
    }
}

export default roleMiddleware;