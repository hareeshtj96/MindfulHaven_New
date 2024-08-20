import React, { useState } from "react";
import loginImg from '../../../Public/banner/login_image.jpg';

function TherapistLogin () {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Name:", name);
        console.log("Phone:", phone);

    };

    return (
        <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${loginImg})` }}>
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl mb-6 text-center">Let's take the first step and create your account</h2>

                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="mb-4">
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Phone Field */}
                    <div className="mb-2">
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Enter your phone number"
                            className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                        Note: An OTP will be sent to this mobile for verification.
                    </p>

                    {/* Continue Button */}
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-customGreen text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TherapistLogin