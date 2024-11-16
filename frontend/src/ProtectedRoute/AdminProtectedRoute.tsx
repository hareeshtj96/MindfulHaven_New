import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../Redux/Store/store"

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
    const token = useSelector((state: RootState) => state.admin.token);
    
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if(!token) {
            sessionStorage.setItem('adminIntendedRoute', location.pathname);
            navigate("/admin/admin_login",{replace: true} );
            
        }
    },[token, navigate, location]);

    return token ? <>{children}</> : null;
}

export default AdminProtectedRoute;