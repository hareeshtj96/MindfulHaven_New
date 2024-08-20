import React, { useState } from "react";
import logoImage from '../../../Public/banner/MindfulHaven_logo.png';

function Header() {
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

        {/* Hamburger Menu for Mobile */}
        <button className="md:hidden text-btncolor" onClick={toggleSidebar}>
            ☰
        </button>

        {/* Navigation Menu */}
        <nav
            className={`fixed top-0 left-0 w-full h-full bg-headercolor z-40 transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-200 ease-in-out md:static md:transform-none md:flex md:items-center md:space-x-8 ml-auto font-semibold`}>
            <div className={`flex flex-col justify-center ${isSidebarOpen ? 'items-center' : 'items-start'} h-full md:flex-row md:h-auto md:items-center md:space-x-8 md:ml-auto`}>
                {/* Close button only visible on mobile */}
                <button
                    className="absolute top-4 right-4 text-btncolor md:hidden"
                    onClick={toggleSidebar}
                >
                    ✕
                </button>
                <a href="/aboutus" className="text-btncolor py-2 md:py-0 text-right">
                    About Us
                </a>
                <a href="/location" className="text-btncolor py-2 md:py-0  text-right">
                    Location
                </a>
                <a href="/login" className="text-btncolor py-2 md:py-0 text-right">
                    Login
                </a>
                <a href="/therapist/therapist_login" className="text-btncolor py-2 md:py-0 text-right">
                    Become a therapist
                </a>
            </div>
        </nav>
    </div>
</header>


        </>
    )
}

export default Header