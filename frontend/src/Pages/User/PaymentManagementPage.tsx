import React from "react";
import PaymentManagement2 from '../../Components/User/PaymentManagement2';
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader"
import Footer from "../../Layout/Footer";


function PaymentManagementPage () {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <PaymentManagement2 />
            <Footer />
            
        </div>
        </>
    )
}

export default PaymentManagementPage