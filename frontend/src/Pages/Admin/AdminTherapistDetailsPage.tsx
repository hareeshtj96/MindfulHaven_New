import React, { useState } from "react";
import AdminTherapistDetails from "../../Components/Admin/AdminTherapistDetails";
import AdminHeader2 from "../../Layout/AdminLayout/AdminHeader2";
import AdminSidebar from "../../Layout/AdminLayout/AdminSidebar";



const AdminTherapistDetailsPage: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    return (
        <div className="flex flex-col min-h-screen">
        <AdminHeader2 />
        <div className="flex flex-row flex-grow">
            <AdminSidebar isSidebarOpen={isSidebarOpen} />
            <div className="flex-grow">
                <AdminTherapistDetails />
            </div>
        </div>
    </div>
    )
}

export default AdminTherapistDetailsPage