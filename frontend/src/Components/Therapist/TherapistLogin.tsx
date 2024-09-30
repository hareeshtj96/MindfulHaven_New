import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { logintherapist, clearError } from "../../Redux/Store/Slices/therapistSlice"
import {Link} from "react-router-dom"
import loginImg from "../../../Public/banner/therapist-login.png";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TherapistLogin () {
    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<{ general?: string }>({});
  

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, error, token} = useSelector((state: RootState) => state.therapist);

    useEffect(() => {
        dispatch(clearError());
    },[dispatch]);

    useEffect(() => {
        if (errors.general || error) {
            toast.error(errors.general || error, { position: 'top-right'})
            const timer = setTimeout(() => {
                setErrors({});
                dispatch(clearError());
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [errors.general, error, dispatch]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(logintherapist({ email, password}));

        if (logintherapist.fulfilled.match(resultAction)) {
            const { token } = resultAction.payload; 
            if (token) {
                toast.success("Login successful", { position: 'top-right'})
                setTimeout(() => {
                    navigate("/therapist/therapist_dashboard");
                },2000);
                
            }
        } else {
            setErrors({general: resultAction.error.message});
            toast.error(resultAction.error.message, { position: 'top-right'})
        }
    };


    return (
        <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${loginImg})` }}>
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl mb-6 text-center">Login to your account</h2>

               
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
                  
                    <div className="mb-2">
                    <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />
                    </div>


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
                        <Link to="/therapist/therapist_register" className="text-blue-500 hover:underline">
                            Don't have an account? Register
                        </Link>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default TherapistLogin