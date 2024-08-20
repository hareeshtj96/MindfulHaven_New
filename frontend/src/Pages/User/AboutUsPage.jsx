import React from "react";
import AboutUs from "../../Components/User/AboutUs";
import Header from "../../Layout/UserLayout/Header";
import Footer from "../../Layout/Footer";

function AboutUsPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <AboutUs />
            <Footer />
            
        </div>
        </>
    )
}

export default AboutUsPage