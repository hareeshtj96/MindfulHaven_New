import React from "react";
import { Route, Routes} from "react-router-dom"
import TherapistRegisterPage from "../../Pages/Therapist/TherapistRegisterPage";
import TherapistOTPPage from "../../Pages/Therapist/TherapistOTPPage";
import TherapistDashboardPage from "../../Pages/Therapist/TherapistDashboardPage";
import TherapistLoginPage from "../../Pages/Therapist/TherapistLoginPage";
import TherapistProtectedRoute from "../../ProtectedRoute/TherapistProtectedRoute";
import TherapistDetailsPage from "../../Pages/Therapist/TherapistDetailsPage";
import TherapistProfilePage from "../../Pages/Therapist/TherapistProfilePage";
import BookingsListPage from "../../Pages/Therapist/BookingsListPage";
import TherapistCalendarPage from "../../Pages/Therapist/TherapistCalendarPage"
import PageNotFoundPage from "../../Pages/User/PageNotFoundPage";



function TherapistRoutes() {
    return (
        <>
        <Routes>
            <Route path="/therapist_register" element={<TherapistRegisterPage />} />
            <Route path="/therapist_login" element={<TherapistLoginPage /> } />
            <Route path="/therapist_OTP" element={<TherapistProtectedRoute> <TherapistOTPPage /> </TherapistProtectedRoute> }/>
            <Route path="/therapist_dashboard" element={<TherapistProtectedRoute> <TherapistDashboardPage /> </TherapistProtectedRoute> } />
            <Route path="/therapist_details" element={<TherapistProtectedRoute> <TherapistDetailsPage /> </TherapistProtectedRoute> }/>
            <Route path="/therapist_profile" element={<TherapistProtectedRoute> <TherapistProfilePage />  </TherapistProtectedRoute>  }/>
            <Route path="/therapist_Calendar" element={<TherapistCalendarPage />}/>
            <Route path="/therapist_bookings/:therapistId" element={<BookingsListPage /> }/>

            <Route path="/*" element={<PageNotFoundPage />}/>
        </Routes>
        </>
    )
}

export default TherapistRoutes