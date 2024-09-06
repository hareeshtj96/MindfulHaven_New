import React from "react";

import Header from "../../Layout/UserLayout/Header";
import Footer from "../../Layout/Footer";
import ForgotPasswordOtp from "../../Components/User/ForgotPasswordOTP";

function ForgotPasswordOtpPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <ForgotPasswordOtp />
            <Footer />
            
        </div>
        </>
    )
}
export default ForgotPasswordOtpPage