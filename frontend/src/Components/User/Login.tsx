import React, {  FormEvent, useEffect, useState } from "react";
import loginImage from '../../../Public/banner/login_img.jpg';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from '../../../Public/banner/Google_logo.png';
import { loginUser,googleRegister, clearError } from "../../Store/Slices/userSlice";
import {auth} from '../../FirebaseConfig/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { RootState, AppDispatch } from "../../../src/Store/store";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<{general?: string}>({})
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const {status, loginError} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(clearError());
    },[dispatch]);

    useEffect(() => {
        if(errors.general || loginError) {
            const timer = setTimeout(() => {
                setErrors({});
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    },[errors.general ,loginError, dispatch]);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log("user goggole auth:", user);

            //dispatch an action to save the user details in redux store
            dispatch(googleRegister({
                name: user.displayName,
                email: user.email,
            }))
            .unwrap()
            .then(() => {
                navigate("/dashboard");
            })
            .catch((error) => {
                // Handle errors, such as if registration or login failed
                console.error("Google Sign-In Error:", error);
                setErrors({ general: "Google Sign-In failed" });
            });
        } catch(error) {
            console.error("Google Sign-In Error:", error);
            setErrors({general: "Google Sign-In failed"});
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("dispatching loginuser with:", {email, password});

        dispatch(loginUser({email, password})).then((action) => {
            if(loginUser.fulfilled.match(action)) {
                
                if(action.payload.token) {
                    console.log("login successful:", action.payload);
                    navigate('/dashboard');
                }
            } else {
                console.log("login failed:", action.payload);
            }
            
        }).catch (error => {
            console.error("Dispath error:", error);
        })
    };

    return (
        <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${loginImage})` }}>
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {/* Sign up with Google Button */}

                <button type="button"  onClick={handleGoogleSignIn}   className="flex items-center justify-center w-full bg-white text-gray-800 font-regular py-2 px-4 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 mb-4">
                <img src={googleLogo} alt="Google logo" className="w-5 h-5 mr-3" />
                    Sign in with Google
                </button>

                <div className="flex items-center mb-4">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-4 text-gray-500">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

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
                    <div className="relative mb-6">

                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Forgot Password Link */}
                         <Link to="/forgot-password" className="absolute top-0 right-0 mt-2 mr-3 text-blue-500 hover:underline">
                            Forgot Password?
                         </Link>
                       
                    </div>

                     
                        

                    {(errors.general || loginError) && (
                        <div className="mb-4 text-red-500 text-center">
                            {errors.general || loginError}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-customGreen text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50"
                        >
                            {status === 'loading' ? 'Logging in...' : 'Login'}
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
