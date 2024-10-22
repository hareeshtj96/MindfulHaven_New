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
        
        
        <div className="flex flex-1">
          {/* Sidebar */}
          <AdminSidebar isSidebarOpen={isSidebarOpen} />

          
          <div className="flex-1 p-4">
            <AdminDashboard />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
