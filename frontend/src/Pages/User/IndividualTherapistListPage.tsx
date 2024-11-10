import React from "react";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader";
import Footer from "../../Layout/Footer";
import IndividualTherapistList from "../../Components/User/IndividualTherapistList"

function IndividualTherapistListPage() {
        
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <IndividualTherapistList />
            <Footer />
            
        </div>
        </>
    )
}
export default IndividualTherapistListPage