import React from "react";
import TherapistLogin from "../../Components/Therapist/TherapistLogin";
import Header from "../../Layout/UserLayout/Header";


function TherapistLoginPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <TherapistLogin />
            
        </div>
        </>
    )
}

export default TherapistLoginPage