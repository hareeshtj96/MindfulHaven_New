import React from "react";
import { Route, Routes} from "react-router-dom"
import UserRegister from "../../Pages/User/UserRegister";
import UserLogin from "../../Pages/User/UserLogin";
import UserLanding from "../../Pages/User/UserLanding";
import AboutUsPage from "../../Pages/User/AboutUsPage";
import LocationPage from "../../Pages/User/LocationPage";
import UserOTP from "../../Pages/User/UserOTP";
import UserDashboardPage from "../../Pages/User/UserDashboardPage";
import UserForgotPassword from "../../Pages/User/UserForgotPassword";
import ForgotPasswordOtpPage from "../../Pages/User/ForgotPasswordOtp"
import PasswordResetPage from "../../Pages/User/PasswordReset";
import UserProfilePage from "../../Pages/User/UserProfilePage";
import ChildTherapistListPage from "../../Pages/User/ChildTherapistListPage";
import SlotManagementPage from "../../Pages/User/SlotManagementPage";
import BookingStatusPage from "../../Pages/User/BookingStatusPage";
import SessionsPage from "../../Pages/User/SessionsPage";
import PageNotFoundPage from "../../Pages/User/PageNotFoundPage";
import PaymentManagementPage from "../../Pages/User/PaymentManagementPage";
import ProtectedRoute from "../../ProtectedRoute/ProtectedRoute";


function UserRoute() {
    return (
        <>
        <Routes>
            <Route path="/" element={<ProtectedRoute> <UserLanding /> </ProtectedRoute> }/>
            <Route path="/register" element={<ProtectedRoute> <UserRegister /> </ProtectedRoute> } />
            <Route path="/login" element={<ProtectedRoute> <UserLogin /> </ProtectedRoute>   } />
            <Route path="/aboutus" element={<AboutUsPage />}/>
            <Route path="/location" element={<LocationPage />} />
            <Route path="/otp_Verify" element={<UserOTP />} />
            <Route path="/dashboard" element={ <UserDashboardPage />} />
            <Route path="/forgot-password" element={ <UserForgotPassword />} />
            <Route path="/forgotPasswordOtp" element={<ForgotPasswordOtpPage /> } />
            <Route path="/password_Reset" element={<PasswordResetPage /> } />
            <Route path="/user_profile" element={<UserProfilePage /> } />
            <Route path="/childTherapy" element={<ChildTherapistListPage /> } />
            <Route path="/slot_management/:therapistId" element={<SlotManagementPage />}/>
            <Route path="/sessions" element={<SessionsPage />}/>
            <Route path="/booking_status/:bookingId" element={<BookingStatusPage /> }/>
            <Route path="/payment" element={<PaymentManagementPage />}/>

            <Route path="/*" element={<PageNotFoundPage />}/>
        </Routes>
        </>
    )
}

export default UserRoute;