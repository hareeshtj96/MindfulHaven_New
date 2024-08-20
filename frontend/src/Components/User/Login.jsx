import React, { useState } from "react";
import loginImage from '../../../Public/banner/login_img.jpg';

import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${loginImage})` }}>
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter email address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mb-6">
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-customGreen text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50"
                        >
                            Login
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Don't have an account? Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
