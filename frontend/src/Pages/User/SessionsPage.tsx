import React from "react";
import Session from "../../Components/User/Session";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader"
import Footer from "../../Layout/Footer";


function SessionsPage () {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <Session />
            <Footer />
            
        </div>
        </>
    )
}

export default SessionsPage