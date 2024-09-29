import React from "react";
import { Route, Routes} from "react-router-dom"
import AdminLoginPage from "../../Pages/Admin/AdminLoginPage";
import AdminDashboardPage from "../../Pages/Admin/AdminDashboardPage"
import AdminTherapistListPage from "../../Pages/Admin/AdminTherapistListPage";
import AdminUserListPage from "../../Pages/Admin/AdminUserListPage";
import AdminTherapistDetailsPage from "../../Pages/Admin/AdminTherapistDetailsPage";
import AdminProtectedRoute from "../../ProtectedRoute/AdminProtectedRoute";



function AdminRoute() {
    return (
        <>
        <Routes>
            <Route path="/admin_login" element={<AdminLoginPage/> } />
            <Route path="/admin_dashboard" element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>  } />
            <Route path="/admin_getTherapist" element={<AdminProtectedRoute><AdminTherapistListPage /></AdminProtectedRoute>  } />
            <Route path="/admin_getUsers" element={<AdminProtectedRoute><AdminUserListPage /></AdminProtectedRoute> } />
            <Route path="/admin_getTherapistDetails/:therapistId" element={<AdminTherapistDetailsPage />}/>
        </Routes>
        </>
    )
}

export default AdminRoute