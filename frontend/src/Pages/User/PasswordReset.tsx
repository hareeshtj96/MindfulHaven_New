import React from "react";
import Header from "../../Layout/UserLayout/Header";
import Footer from "../../Layout/Footer";
import PasswordReset from "../../Components/User/PasswordReset";

function PasswordResetPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <PasswordReset />
            <Footer />
            
        </div>
        </>
    )
}
export default  PasswordResetPage;