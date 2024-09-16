import React from "react";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader";
import Footer from "../../Layout/Footer";
import UserProfile from "../../Components/User/UserProfile";

function UserProfilePage() {
        
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <UserProfile />
            <Footer />
            
        </div>
        </>
    )
}
export default UserProfilePage