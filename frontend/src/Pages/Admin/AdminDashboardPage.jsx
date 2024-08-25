import React from "react";
import AdminDashboard from "../../Components/Admin/AdminDashboard";
import AdminHeader2 from "../../Layout/AdminLayout/AdminHeader2";
import AdminSidebar from "../../Layout/AdminLayout/AdminSidebar";



function AdminDashboardPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <AdminHeader2 />
            <AdminSidebar />
            <AdminDashboard />
          
            
        </div>
        </>
    )
}

export default AdminDashboardPage