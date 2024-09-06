import React, { useState } from "react";
import TherapistProfileView from "../../Components/Therapist/TherapistProfileView";
import TherapistHeader2 from "../../Layout/TherapistLayout/TherapistHeader2";



function TherapistProfilePage() {
    
    return (
        <>
         <div className="flex flex-col min-h-screen">
         <TherapistHeader2 />
         <TherapistProfileView />
         </div>
        
        </>
    )
}

export default TherapistProfilePage;