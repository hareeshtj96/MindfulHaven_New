import React, { useState } from "react";
import AdminDashboard from "../../Components/Admin/AdminDashboard";
import AdminHeader2 from "../../Layout/AdminLayout/AdminHeader2";
import AdminSidebar from "../../Layout/AdminLayout/AdminSidebar";



const AdminDashboardPage: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <AdminHeader2 />
            <AdminSidebar  isSidebarOpen={isSidebarOpen}/>
            <AdminDashboard />
          
            
        </div>
        </>
    )
}

export default AdminDashboardPage