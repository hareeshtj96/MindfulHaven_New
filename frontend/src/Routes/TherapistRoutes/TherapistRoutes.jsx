import React from "react";
import { Route, Routes} from "react-router-dom"
import TherapistLoginPage from "../../Pages/Therapist/TherapistLoginPage";


function TherapistRoutes() {
    return (
        <>
        <Routes>
            <Route path="/therapist_login" element={<TherapistLoginPage />} />
        </Routes>
        </>
    )
}

export default TherapistRoutes