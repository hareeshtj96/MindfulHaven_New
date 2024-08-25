import React from "react";
import { Route, Routes} from "react-router-dom"
import TherapistLoginPage from "../../Pages/Therapist/TherapistLoginPage";
import TherapistOTPPage from "../../Pages/Therapist/TherapistOTPPage";
import TherapistDashboardPage from "../../Pages/Therapist/TherapistDashboardPage";


function TherapistRoutes() {
    return (
        <>
        <Routes>
            <Route path="/therapist_login" element={<TherapistLoginPage />} />
            <Route path="/therapist_OTP" element={<TherapistOTPPage />}/>
            <Route path="/therapist_dashboard" element={<TherapistDashboardPage />} />
        </Routes>
        </>
    )
}

export default TherapistRoutes