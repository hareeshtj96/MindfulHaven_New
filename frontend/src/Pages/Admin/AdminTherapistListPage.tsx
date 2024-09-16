import React, { useState } from "react";
import AdminTherapistList from "../../Components/Admin/AdminTherapistList";
import AdminHeader2 from "../../Layout/AdminLayout/AdminHeader2";
import AdminSidebar from "../../Layout/AdminLayout/AdminSidebar";



const AdminTherapistListPage: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    return (
        <div className="flex flex-col min-h-screen">
        <AdminHeader2 />
        <div className="flex flex-row flex-grow">
            <AdminSidebar isSidebarOpen={isSidebarOpen} />
            <div className="flex-grow">
                <AdminTherapistList />
            </div>
        </div>
    </div>
    )
}

export default AdminTherapistListPage