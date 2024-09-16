import React, { useState, useEffect, FormEvent } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from "react-router-dom";
import backgroundImage from '../../../Public/banner/register_img.jpg';
import { registerUser, googleRegister,  clearError } from "../../Redux/Store/Slices/userSlice";
import googleLogo from '../../../Public/banner/Google_logo.png';
import {Link} from "react-router-dom"
import {auth} from '../../FirebaseConfig/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import axios from "axios";



//define type for error state
interface Errors {
    name?: string;
    email?: string;
    mobile?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

function Register() {
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [mobile, setMobile] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [errors, setErrors] = useState<Errors>({})
    const [cancelTokenSource] = useState(axios.CancelToken.source);

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const {status, error} = useSelector((state: RootState) => state.user);


    useEffect(() => {
        dispatch(clearError());
    },[dispatch]);


    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const timer = setTimeout(() => {
                setErrors({});
                dispatch(clearError());
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [errors.general, error, dispatch]);

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
            });
        } catch(error) {
            console.error("Google Sign-In Error:", error);
            setErrors({general: "Google Sign-In failed"});
        }
    }

    const validate = (): Errors => {
        const errors: Errors = {};
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]{9}$/;

        if(!name) {
            errors.name = "Name is required";
        } else if (!nameRegex.test(name)) {
            errors.name = "Name should contain only alphabets and spaces";
        }

        if(!email) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            errors.email = "Enter a valid email address";
        }

        if(!mobile) {
            errors.mobile = "Mobile number is required";
        } else if(!mobileRegex.test(mobile)) {
            errors.mobile = "Enter a valid 10-digit mobile number starting with 6-9";
        }

        if(!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
        }

        if(!confirmPassword) {
            errors.confirmPassword = "Confirm password is required";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        return errors;
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const validateErrors = validate();

        console.log("Before validation:", {name, email, mobile, password, confirmPassword})

        if(Object.keys(validateErrors).length > 0) {
            setErrors(validateErrors);
            return;
        }

        console.log("After validation:", {name, email, mobile, password, confirmPassword});

        setErrors({});
        dispatch(registerUser({name, email, mobile, password}))
            .unwrap()
            .then(() => {
                navigate("/otp_verify");
            })
            .catch((err) => {
                setErrors({general: err.message || 'Registration failed, user already exists'});
            })
    }

    // cleanup function to cancel the request if component unmounts
    useEffect(() => {
        return () => {
            cancelTokenSource.cancel('operation canceled by user');
        }
    },[cancelTokenSource]);
    
    const handleMobileInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Only allow numbers (0-9), Backspace, Delete, Arrow keys
        if (!/^[0-9]$/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
            e.preventDefault();
        }
    };
    

    return (
        <div className="flex justify-center items-center h-screen  bg-cover bg-center" style={{backgroundImage: `url(${backgroundImage})`}}>
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {/* Sign up with Google Button */}

                <button type="button"  onClick={handleGoogleSignIn} className="flex items-center justify-center w-full bg-white text-gray-800 font-regular py-2 px-4 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 mb-4">
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
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            className={`w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : ""
                            }`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                            className={`w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : ""
                            }`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            placeholder="Enter mobile number"
                            className={`w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.mobile ? "border-red-500" : ""}`}
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            onKeyDown={handleMobileInput}
                        />
                        {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter password"
                            className={`w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : ""
                            }`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div className="mb-6">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            className={`w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? "border-red-500" : ""
                            }`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
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

                {status === 'loading' && <p>Loading...</p>}
                {status === 'failed' && <p className="text-red-500">{errors.general || error}</p>}
            </div>
        </div>
    )
}
export default Register;