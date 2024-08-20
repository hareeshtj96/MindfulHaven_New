import React from "react";
import { Route, Routes} from "react-router-dom"
import UserRegister from "../../Pages/User/UserRegister";
import UserLogin from "../../Pages/User/UserLogin";
import UserLanding from "../../Pages/User/UserLanding";
import AboutUsPage from "../../Pages/User/AboutUsPage";
import LocationPage from "../../Pages/User/LocationPage";

function UserRoute() {
    return (
        <>
        <Routes>
            <Route path="/" element={<UserLanding />}/>
            <Route path="/register" element={<UserRegister />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/aboutus" element={<AboutUsPage />}/>
            <Route path="/location" element={<LocationPage />} />
        </Routes>
        </>
    )
}

export default UserRoute;