import React, { useState } from "react";
import TherapistCalender2 from "../../Components/Therapist/TherapistCalender2";
import TherapistHeader2 from "../../Layout/TherapistLayout/TherapistHeader2";



function TherapistCalendarPage() {
    
    return (
        <>
         <div className="flex flex-col min-h-screen">
         <TherapistHeader2 />
         <TherapistCalender2 />
         </div>
        
        </>
    )
}

export default TherapistCalendarPage;