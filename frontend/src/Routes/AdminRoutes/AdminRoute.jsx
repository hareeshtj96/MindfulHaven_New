import React from "react";
import { Route, Routes} from "react-router-dom"
import AdminLoginPage from "../../Pages/Admin/AdminLoginPage";
import AdminDashboardPage from "../../Pages/Admin/AdminDashboardPage";
import AdminProtectedRoute from "../../ProtectedRoute/AdminProtectedRoute";


function AdminRoute() {
    return (
        <>
        <Routes>
            <Route path="/admin_login" element={ <AdminLoginPage/>  } />
            <Route path="/admin_dashboard" element={<AdminProtectedRoute> <AdminDashboardPage /> </AdminProtectedRoute> } />
        </Routes>
        </>
    )
}

export default AdminRoute