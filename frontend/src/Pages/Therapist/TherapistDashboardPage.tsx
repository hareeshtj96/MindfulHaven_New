import React from "react";
import TherapistDashboard from "../../Components/Therapist/TherapistDashboard";
import TherapistHeader2 from "../../Layout/TherapistLayout/TherapistHeader2";
import TherapistSidebar from "../../Layout/TherapistLayout/TherapistSidebar";


function TherapistDashboardPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <TherapistHeader2 />
            <TherapistSidebar />
            <TherapistDashboard therapistId={""} />
            
        </div>
        </>
    )
}

export default TherapistDashboardPage;