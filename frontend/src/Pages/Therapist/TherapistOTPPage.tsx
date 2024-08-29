import React from "react";
import TherapistOTP from "../../Components/Therapist/TherapistOTP";
import TherapistHeader from "../../Layout/TherapistLayout/TherapistHeader";


function TherapistOTPPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <TherapistHeader />
            <TherapistOTP/>
            
        </div>
        </>
    )
}

export default TherapistOTPPage;