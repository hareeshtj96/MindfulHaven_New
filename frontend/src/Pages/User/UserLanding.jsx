import React from "react";
import LandingPage from "../../Components/User/Landing";
import Header from "../../Layout/UserLayout/Header";
import Footer from "../../Layout/Footer";

function UserLanding() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <LandingPage />
            <Footer />
            
        </div>
        </>
    )
}

export default UserLanding