import React from "react";
import Login from "../../Components/User/Login";
import Header from "../../Layout/UserLayout/Header";


function UserLogin () {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <Login />
            
        </div>
        </>
    )
}

export default UserLogin