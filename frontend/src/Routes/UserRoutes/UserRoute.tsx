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
import VideoCall from "../../Components/User/VideoComponent";
import ChangePassword from "../../Components/User/ChangePassword";
import UserWallet from "../../Components/User/UserWallet";
import IssueManagement from "../../Components/User/IssueManagement";
import FamilyTherapistListPage from "../../Pages/User/FamilyTherapistListPage";
import IndividualTherapistListPage from "../../Pages/User/IndividualTherapistListPage";
import CoupleTherapistListPage from "../../Pages/User/CoupleTherapistListPage";


function UserRoute() {
    return (
        <>
        <Routes>
            <Route path="/" element={<UserLanding /> }/>
            <Route path="/register" element={<UserRegister /> } />
            <Route path="/login" element={<UserLogin /> } />
            <Route path="/aboutus" element={<AboutUsPage />}/>
            <Route path="/location" element={<LocationPage />} />
            <Route path="/otp_Verify" element={<UserOTP />} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute> } />
            <Route path="/forgot-password" element={ <UserForgotPassword />} />
            <Route path="/forgotPasswordOtp" element={<ForgotPasswordOtpPage /> } />
            <Route path="/password_Reset" element={<PasswordResetPage /> } />
            
            <Route path="/user_profile" element={<ProtectedRoute> <UserProfilePage /> </ProtectedRoute> } >

            <Route path="changePassword" element={<ProtectedRoute> <ChangePassword /> </ProtectedRoute> } />
            <Route path="wallet" element={<ProtectedRoute> <UserWallet /> </ProtectedRoute> } />
            <Route path="basicDetails" element={<></>} />
            </Route>

            <Route path="/childTherapy" element={<ProtectedRoute> <ChildTherapistListPage /> </ProtectedRoute>  } />
            <Route path="/familyTherapy" element={<ProtectedRoute> <FamilyTherapistListPage /> </ProtectedRoute>} />
            <Route path="/slot_management/:therapistId" element={<ProtectedRoute> <SlotManagementPage /> </ProtectedRoute> }/>
            <Route path="/sessions" element={<ProtectedRoute><SessionsPage /></ProtectedRoute>}/>
            <Route path="/booking_status/:bookingId" element={<ProtectedRoute> <BookingStatusPage /> </ProtectedRoute> }/>
            <Route path="/payment" element={<ProtectedRoute><PaymentManagementPage /></ProtectedRoute>}/>
            <Route path="/video-call/:roomId" element={<ProtectedRoute><VideoCall /></ProtectedRoute> } />
            <Route path="/issue_management" element={<ProtectedRoute><IssueManagement /></ProtectedRoute>} />
            <Route path="/individualTherapy" element={<ProtectedRoute><IndividualTherapistListPage /></ProtectedRoute>} />
            <Route path="/coupleTherapy" element={<ProtectedRoute><CoupleTherapistListPage /></ProtectedRoute>} />

            <Route path="/*" element={<PageNotFoundPage />}/>
        </Routes>
        </>
    )
}

export default UserRoute;