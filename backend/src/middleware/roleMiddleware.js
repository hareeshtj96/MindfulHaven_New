"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        var _a;
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Authorization header missing' });
            }
            const token = authHeader.split(' ')[1];
            const decodedToken = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            console.log("decoded Token:", decodedToken);
            const role = (_a = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userData) === null || _a === void 0 ? void 0 : _a.role;
            console.log("role from rolemiddleware:", role);
            if (!role || !allowedRoles.includes(role)) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }
            next();
        }
        catch (error) {
            console.error('Role-based access error:', error);
            res.status(401).json({ message: 'Invalid token or unauthorized access' });
        }
    };
};
exports.default = roleMiddleware;
