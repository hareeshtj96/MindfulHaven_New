import React from "react";
import TherapistLogin from "../../Components/Therapist/TherapistLogin";
import TherapistHeader from "../../Layout/TherapistLayout/TherapistHeader";


function TherapistLoginPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <TherapistHeader/>
            <TherapistLogin  />
            
        </div>
        </>
    )
}

export default TherapistLoginPage