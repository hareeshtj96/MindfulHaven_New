import React from "react";
import SlotManagement from "../../Components/User/SlotManagement";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader"
import Footer from "../../Layout/Footer";


function SlotManagementPage () {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <SlotManagement />
            <Footer />
            
        </div>
        </>
    )
}

export default SlotManagementPage