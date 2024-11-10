import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../Redux/Store/store";

interface TherapistProtectedRouteProps {
    children: React.ReactNode;
}

const TherapistProtectedRoute: React.FC<TherapistProtectedRouteProps> = ({ children }) => {
    const token = useSelector((state: RootState) => state.therapist.token);
    
    const navigate = useNavigate()

    useEffect(() => {
        if(!token) {
            navigate("/therapist/therapist_login", {replace: true});
            
        }
    },[token, navigate]);

    if(token) {
        return children
    }
    return null;
}

export default TherapistProtectedRoute;