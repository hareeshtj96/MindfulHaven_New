import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../Redux/Store/store"

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
    const token = useSelector((state: RootState) => state.admin.token);
    const navigate = useNavigate()

    useEffect(() => {
        if(!token) {
            console.log("Admin not authenticated, redirecting to login");
            navigate("/admin/admin_login", {replace: true});
            
        }
    },[token, navigate]);

    if(token) {
        return children
    }
    return null;
}

export default AdminProtectedRoute;