import React from "react";
import { Route, Routes} from "react-router-dom"
import AdminLoginPage from "../../Pages/Admin/AdminLoginPage";


function AdminRoute() {
    return (
        <>
        <Routes>
            <Route path="/admin_login" element={<AdminLoginPage/>} />
        </Routes>
        </>
    )
}

export default AdminRoute