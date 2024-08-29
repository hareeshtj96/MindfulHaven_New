import React from "react";
import locationImg from '../../../Public/banner/location.jpg';

function Location () {
    return (
        <div className="container mx-auto px-4 py-8">
            
            <section className="flex justify-center items-center py-8">
                <div className="w-full max-w-2xl md:max-w-3xl">
                    <img src={locationImg} alt="About Us" className="w-full h-auto" />
                </div>
            </section>

           
            <section className="mt-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Visit Us</h2>
                
                <address className="mt-4 text-lg md:text-xl text-gray-700">
                    MindfulHaven<br />
                    Rajender Nagar<br />
                    New Delhi, 110001
                </address>
                <p className="mt-4 text-lg md:text-xl text-gray-700">
                    We offer convenient online consultations to fit your schedule. <br />
                    Available Monday - Friday: 9:00 AM - 8:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: By appointment only<br />
                    Connect with our expert therapists from the comfort of your home, no matter where you are.
                </p>
            </section>
        </div>
    );
}

export default Location