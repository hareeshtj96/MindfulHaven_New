import React from "react";

import DashboardHeader from "../../Layout/UserLayout/DashboardHeader";
import Footer from "../../Layout/Footer";
import Dashboard from "../../Components/User/UserDashboard";

function UserDashboardPage() {
        
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <Dashboard />
            <Footer />
            
        </div>
        </>
    )
}
export default UserDashboardPage