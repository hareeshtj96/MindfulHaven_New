import React from "react";
import AdminLogin from "../../Components/Admin/AdminLogin";
import AdminHeader from "../../Layout/AdminLayout/AdminHeader";


function AdminLoginPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <AdminHeader />
            <AdminLogin />
            
        </div>
        </>
    )
}

export default AdminLoginPage