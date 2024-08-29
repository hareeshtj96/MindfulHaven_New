import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerTherapist, clearError } from "../../Store/Slices/therapistSlice";
import {Link} from "react-router-dom"
import loginImg from '../../../Public/banner/login_image.jpg';
import { RootState, AppDispatch } from "../../../src/Store/store";

interface ErrorState {
    general?: string;
}

function TherapistRegister () {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<ErrorState>({});

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, error, token} = useSelector((state: RootState) => state.therapist);

    
    
    useEffect(() => {
        dispatch(clearError());
    },[dispatch]);

    useEffect(() => {
        if (errors.general || error) {
            const timer = setTimeout(() => {
                setErrors({});
                dispatch(clearError());
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [errors.general, error, dispatch]);



    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if(password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const resultAction = await dispatch(registerTherapist({ name , email, password}));

        if (registerTherapist.fulfilled.match(resultAction)) {
            const { token } = resultAction.payload; 
            if (token) {
                
                navigate("/therapist/therapist_OTP");
            }
        } else {
            
            setErrors({general: resultAction.error.message});
        }
    };


    return (
        <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${loginImg})` }}>
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl mb-6 text-center">Let's take the first step and create your account</h2>

                {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="mb-4">
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            required
                        />
                    </div>

                    
                    <div className="mb-2">
                    <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e:  ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                     {/* Password Field */}
                     <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e:ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={(e:ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>


                    <p className="text-xs text-gray-500 mb-4">
                        Note: An OTP will be sent to this email for verification.
                    </p>

                    {/* Continue Button */}
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-customGreen text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Continue'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/therapist/therapist_login" className="text-blue-500 hover:underline">
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TherapistRegister 