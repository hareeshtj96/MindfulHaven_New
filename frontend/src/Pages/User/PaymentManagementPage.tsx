import React from "react";
import PaymentManagement from "../../Components/User/PaymentManagement";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader"
import Footer from "../../Layout/Footer";


function PaymentManagementPage () {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <PaymentManagement />
            <Footer />
            
        </div>
        </>
    )
}

export default PaymentManagementPage