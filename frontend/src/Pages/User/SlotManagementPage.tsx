import React from "react";
import SlotManagement from "../../Components/User/SlotManagement";
import SlotManagement2 from "../../Components/User/slotManagement2";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader"
import Footer from "../../Layout/Footer";


function SlotManagementPage () {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <SlotManagement2 />
            <Footer />
            
        </div>
        </>
    )
}

export default SlotManagementPage