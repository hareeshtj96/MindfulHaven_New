import React from "react";
import TherapistHeader2 from "../../Layout/TherapistLayout/TherapistHeader2";
import TherapistSidebar from "../../Layout/TherapistLayout/TherapistSidebar";
import BookingsList2 from "../../Components/Therapist/BookingList2";


function BookingsListPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <TherapistHeader2 />
            <TherapistSidebar />
            <BookingsList2 />
            
        </div>
        </>
    )
}

export default BookingsListPage;