import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../Redux/Store/store";

interface TherapistProtectedRouteProps {
    children: React.ReactNode;
}

const TherapistProtectedRoute: React.FC<TherapistProtectedRouteProps> = ({ children }) => {
    const token = useSelector((state: RootState) => state.therapist.token);
    
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        if(!token) {
            sessionStorage.setItem('therapistIntendedRoute', location.pathname);
            navigate("/therapist/therapist_login", {replace: true});
            
        }
    },[token, navigate, location]);

    return token ? <>{children}</> : null;
}

export default TherapistProtectedRoute;