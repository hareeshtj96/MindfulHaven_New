import React, { useState } from "react";
import TherapistDetails from "../../Components/Therapist/TherapistDetails";
import TherapistHeader2 from "../../Layout/TherapistLayout/TherapistHeader2";



function TherapistDetailsPage() {
    
    return (
        <>
         <div className="flex flex-col min-h-screen">
         <TherapistHeader2 />
         <TherapistDetails />
         </div>
        
        </>
    )
}

export default TherapistDetailsPage;