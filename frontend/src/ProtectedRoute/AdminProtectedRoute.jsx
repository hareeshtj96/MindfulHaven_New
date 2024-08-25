import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    const token = useSelector((state) => state.admin.token);
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