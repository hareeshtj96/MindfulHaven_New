import React from "react";
import { Route, Routes} from "react-router-dom"
import TherapistRegisterPage from "../../Pages/Therapist/TherapistRegisterPage";
import TherapistOTPPage from "../../Pages/Therapist/TherapistOTPPage";
import TherapistDashboardPage from "../../Pages/Therapist/TherapistDashboardPage";
import TherapistLoginPage from "../../Pages/Therapist/TherapistLoginPage";
import TherapistProtectedRoute from "../../ProtectedRoute/TherapistProtectedRoute";


function TherapistRoutes() {
    return (
        <>
        <Routes>
            <Route path="/therapist_register" element={<TherapistRegisterPage />} />
            <Route path="/therapist_login" element={<TherapistLoginPage /> } />
            <Route path="/therapist_OTP" element={<TherapistProtectedRoute> <TherapistOTPPage /> </TherapistProtectedRoute> }/>
            <Route path="/therapist_dashboard" element={<TherapistProtectedRoute> <TherapistDashboardPage /> </TherapistProtectedRoute> } />
        </Routes>
        </>
    )
}

export default TherapistRoutes