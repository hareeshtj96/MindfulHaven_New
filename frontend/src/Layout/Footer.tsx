import React from "react";

function Footer() {
    return (
        <footer className="bg-footerBg text-black py-10 md:py-16">
            <div className="container mx-auto max-w-screen-xl flex flex-col md:flex-row flex-wrap justify-between items-start space-y-10 md:space-y-0 md:space-x-10">
                <div className="w-full md:w-1/4 lg:w-auto">
                    <h2 className="text-lg font-bold text-center">MindfulHaven</h2>
                    <ul className="mt-2 space-y-2 text-center">
                        <li>About Us</li>
                        <li>Pricing & Cost</li>
                        <li>Locations</li>
                        <li>FAQs</li>
                    </ul>
                </div>

                <div className="w-full md:w-1/4 lg:w-auto">
                    <h2 className="text-lg font-bold text-center">Resources</h2>
                    <ul className="mt-2 space-y-2 text-center">
                        <li>Anxiety</li>
                        <li>Depression</li>
                        <li>Relationships</li>
                        <li>Self-care</li>
                        <li>Stress</li>
                    </ul>
                </div>

                <div className="w-full  md:w-1/4 lg:w-auto">
                    <h2 className="text-lg font-bold text-center">Services</h2>
                    <ul className="mt-2 space-y-2 text-center">
                        <li>Individual Therapy</li>
                        <li>Couple Therapy</li>
                        <li>Family Therapy</li>
                        <li>Child/Teen Therapy</li>
                    </ul>
                </div>

                <div className="w-full md:w-1/4 lg:w-auto">
                    <h2 className="text-lg font-bold text-center">Reach Us</h2>
                    <ul className="mt-2 space-y-2 text-center">
                        <li>9546839021</li>
                        <li>Contact Us</li>

                    </ul>
                </div>

                <div className="w-full md:w-1/2 lg:w-auto">
                    <h2 className="text-lg font-bold text-center">Get the latest mental wellness tips</h2> 
                    <p className="text-sm mt-2 text-center">delivered straight to your inbox</p>
                    
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4">
                        <input type="email" placeholder="Enter your email address" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 w-full" />
                        <button className="bg-customGreen text-white font-bold py-2 px-4 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50">Subscribe</button>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;