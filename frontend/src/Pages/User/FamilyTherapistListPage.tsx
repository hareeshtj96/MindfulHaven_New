import React from "react";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader";
import Footer from "../../Layout/Footer";
import FamilyTherapistList from "../../Components/User/FamilyTherapistList"

function FamilyTherapistListPage() {
        
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <FamilyTherapistList />
            <Footer />
            
        </div>
        </>
    )
}
export default FamilyTherapistListPage