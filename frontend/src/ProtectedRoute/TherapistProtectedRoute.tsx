import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../src/Store/store";

interface TherapistProtectedRouteProps {
    children: React.ReactNode;
}

const TherapistProtectedRoute: React.FC<TherapistProtectedRouteProps> = ({ children }) => {
    const token = useSelector((state: RootState) => state.therapist.token);
    console.log("therapist protected token:",token);
    const navigate = useNavigate()

    useEffect(() => {
        if(!token) {
            console.log("Therapist not authenticated, redirecting to login");
            navigate("/therapist/therapist_login", {replace: true});
            
        }
    },[token, navigate]);

    if(token) {
        return children
    }
    return null;
}

export default TherapistProtectedRoute;