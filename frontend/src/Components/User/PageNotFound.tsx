import React from "react";
import PageNotFoundIimg from "../../../Public/banner/404 Page.jpg";



function PageNotFound() {
    return (
        <div className="container mx-auto px-4 py-8">
            <section className="flex justify-center items-center py-8">
                <img src={PageNotFoundIimg} alt="Page Not Found" className="w-full h-auto max-w-lg" />
            </section>

            <section className="mt-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">404- Page Not Found</h2>
                <p className="mt-4 text-lg md:text-xl text-gray-700">
                    Oops! The page you're looking for doesn't exist.
                </p>
                <p className="mt-4 text-lg md:text-xl text-gray-700">
                    It looks like the page you are trying to access is either moved or never existed.
                </p>
                <a href="/" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">Go Back Home</a>
            </section>
        </div>
    )
}

export default PageNotFound;