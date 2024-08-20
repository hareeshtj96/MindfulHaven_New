import React, { useState } from "react";
import backgroundImage from '../../../Public/banner/register_img.jpg';
import googleLogo from '../../../Public/banner/Google_logo.png';
import {Link} from "react-router-dom"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Mobile:", mobile);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);
        
    }
    return (
        <div className="flex justify-center items-center h-screen  bg-cover bg-center" style={{backgroundImage: `url(${backgroundImage})`}}>
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {/* Sign up with Google Button */}

                <button type="button" className="flex items-center justify-center w-full bg-white text-gray-800 font-regular py-2 px-4 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 mb-4">
                <img src={googleLogo} alt="Google logo" className="w-5 h-5 mr-3" />
                    Sign up with Google
                </button>

                <div className="flex items-center mb-4">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-4 text-gray-500">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                <form onSubmit={handleSubmit}>

                <div className="mb-4">
                        <input
                            type="name"
                            id="name"
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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

                    <div className="mb-4">
                        <input
                            type="tel"
                            id="mobile"
                            placeholder="Enter mobile number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
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

                    <div className="mb-6">
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-customGreen text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50"
                        >
                            Register
                        </button>
                    </div>
                    <div className="text-center">
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Register;