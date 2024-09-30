import React from "react";
import PageNotFound from "../../Components/User/PageNotFound";
import Header from "../../Layout/UserLayout/Header";
import Footer from "../../Layout/Footer";

function PageNotFoundPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <PageNotFound />
            <Footer />
            
        </div>
        </>
    )
}

export default PageNotFoundPage