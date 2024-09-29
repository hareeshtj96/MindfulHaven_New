import React from "react";
import BookingsList from "../../Components/Therapist/BookingsList";
import TherapistHeader2 from "../../Layout/TherapistLayout/TherapistHeader2";
import TherapistSidebar from "../../Layout/TherapistLayout/TherapistSidebar";


function BookingsListPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <TherapistHeader2 />
            <TherapistSidebar />
            <BookingsList />
            
        </div>
        </>
    )
}

export default BookingsListPage;