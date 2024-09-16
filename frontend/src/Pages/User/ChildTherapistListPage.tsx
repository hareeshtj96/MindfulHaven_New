import React from "react";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader";
import Footer from "../../Layout/Footer";
import ChildTherapistList from "../../Components/User/ChildTherapistList";

function ChildTherapistListPage() {
        
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <ChildTherapistList />
            <Footer />
            
        </div>
        </>
    )
}
export default ChildTherapistListPage