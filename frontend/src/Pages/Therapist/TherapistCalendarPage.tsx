import React, { useState } from "react";
import TherapistCalendar from "../../Components/Therapist/TherapistCalendar";
import TherapistHeader2 from "../../Layout/TherapistLayout/TherapistHeader2";



function TherapistCalendarPage() {
    
    return (
        <>
         <div className="flex flex-col min-h-screen">
         <TherapistHeader2 />
         <TherapistCalendar />
         </div>
        
        </>
    )
}

export default TherapistCalendarPage;