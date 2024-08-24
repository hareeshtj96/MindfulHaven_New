import React from "react";
import OtpVerification from "../../Components/User/OTPPage";
import Header from "../../Layout/UserLayout/Header";


function UserOTP () {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <OtpVerification />
            
        </div>
        </>
    )
}

export default UserOTP