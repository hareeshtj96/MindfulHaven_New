import React from "react";
import Session2 from "../../Components/User/session2";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader"
import Footer from "../../Layout/Footer";


function SessionsPage () {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <Session2 />
            <Footer />
            
        </div>
        </>
    )
}

export default SessionsPage