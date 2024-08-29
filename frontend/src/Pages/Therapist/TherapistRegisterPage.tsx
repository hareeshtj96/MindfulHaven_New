import React from "react";
import TherapistRegister from "../../Components/Therapist/TherapistRegister";
import TherapistHeader from "../../Layout/TherapistLayout/TherapistHeader";


function TherapistRegisterPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <TherapistHeader/>
            <TherapistRegister  />
            
        </div>
        </>
    )
}

export default TherapistRegisterPage