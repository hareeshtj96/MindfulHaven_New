import React, { useState } from "react";
import logoImage from '../../../Public/banner/MindfulHaven_logo.png';

function AdminHeader() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    };

    return (
        <>
        <header className="bg-headercolor shadow-md sticky top-0 z-50">
    <div className="container mx-auto flex justify-between items-center py-2 px-4 md:px-6">

        <div className="flex items-center space-x-2 flex-shrink-0">
            <img src={logoImage} alt="MindfulHaven Logo" className="h-12 w-auto md:h-20" />
            <div className="text-lg md:text-2xl font-bold text-btncolor whitespace-nowrap">MindfulHaven</div>
        </div>

       
        
    </div>
</header>


        </>
    )
}

export default AdminHeader