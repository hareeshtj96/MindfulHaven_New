import React from "react";
import Register from "../../Components/User/Register";
import Header from "../../Layout/UserLayout/Header";



function UserRegister() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <Register />
            
        </div>
        </>
    )
}

export default UserRegister;