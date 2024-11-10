import React from "react";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader";
import Footer from "../../Layout/Footer";
import CoupleTherapistList from "../../Components/User/CoupleTherapistList";

function CoupleTherapistListPage() {
        
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <CoupleTherapistList />
            <Footer />
            
        </div>
        </>
    )
}
export default CoupleTherapistListPage