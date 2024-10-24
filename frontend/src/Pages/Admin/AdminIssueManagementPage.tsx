import React, { useState } from "react";
import AdminIssuesManagement from "../../Components/Admin/AdminIssueManagement";
import AdminHeader2 from "../../Layout/AdminLayout/AdminHeader2";
import AdminSidebar from "../../Layout/AdminLayout/AdminSidebar";

const AdminIssueManagementPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        
        <AdminHeader2 />
        
        
        <div className="flex flex-1">
          {/* Sidebar */}
          <AdminSidebar isSidebarOpen={isSidebarOpen} />

          
          <div className="flex-1 p-4">
            <AdminIssuesManagement />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminIssueManagementPage;
