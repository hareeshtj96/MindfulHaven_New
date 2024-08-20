import React from "react";

import Header from "../../Layout/UserLayout/Header";
import Footer from "../../Layout/Footer";
import Location from "../../Components/User/Location";

function LocationPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <Location />
            <Footer />
            
        </div>
        </>
    )
}
export default LocationPage