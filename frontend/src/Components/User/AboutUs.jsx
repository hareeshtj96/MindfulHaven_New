import React from "react";
import aboutImg from '../../../Public/banner/About.png';

function AboutUs () {
    return (
        <div>
         
         <section className="flex justify-center items-center py-8">
            <div className="w-full max-w-3xl md:max-w-5xl">
                <img src={aboutImg} alt="About Us" className="w-full h-auto" />
            </div>
         </section>

           
            <section className="p-8 md:p-16 bg-white">
                <div className="max-w-4xl mx-auto text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-customColor mb-6">About Us</h2>
                    <p className="text-lg md:text-xl font-regular text-gray-700 leading-relaxed">
                        At MindfulHaven, we believe in the transformative power of personalized therapy. Our mission is to provide a supportive and accessible platform where individuals can find the right therapeutic support tailored to their unique needs.
                        <br /><br />
                        Whether you're seeking guidance for family dynamics, adult or teen challenges, divorce recovery, or overall wellness, MindfulHaven connects you with qualified therapists who are highly reviewed by our community of users.
                        <br /><br />
                        Through our intuitive platform, clients can explore various therapy options, read honest reviews, and select a therapist who best fits their needs. Booking a session is seamless and convenient, with the added benefit of secure video conferencing that brings therapy right to your home.
                        <br /><br />
                        At MindfulHaven, we are dedicated to fostering a space where you can embark on your journey towards healing and personal growth with confidence and ease. Your well-being is our priority, and we are here to support you every step of the way.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default AboutUs