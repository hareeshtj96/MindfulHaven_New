import React from "react";
import BookingStatus from "../../Components/User/BookingStatus";
import DashboardHeader from "../../Layout/UserLayout/DashboardHeader"
import Footer from "../../Layout/Footer";


function BookingStatusPage () {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <DashboardHeader />
            <BookingStatus />
            <Footer />
            
        </div>
        </>
    )
}

export default BookingStatusPage