import React from "react";
import ForgotPassword from "../../Components/User/ForgotPassword";
import Header from "../../Layout/UserLayout/Header";


function UserForgotPassword () {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <ForgotPassword />
            
        </div>
        </>
    )
}

export default UserForgotPassword