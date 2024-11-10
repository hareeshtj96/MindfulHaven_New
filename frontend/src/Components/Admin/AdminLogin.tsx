import React, { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../Redux/Store/store";
import { loginAdmin, resetLoading } from "../../Redux/Store/Slices/adminSlice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminLogin() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state: RootState) => state.admin); 

    useEffect(() => {
        return () => {
            dispatch(resetLoading());
        };
    }, []);
    
        

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(loginAdmin({ email, password }));
        console.log("result action....", resultAction);

        if (loginAdmin.fulfilled.match(resultAction)) {
            const { token, status, message } = resultAction.payload; 
            if ( status && token) {
                toast.success("Login successful", { position: 'top-right'})

                setTimeout(() => {
                    navigate("/admin/admin_dashboard");
                },2000);
                
            } else {
                toast.error(message || "Login failed. Please check your credentials.",  { position: 'top-right'})
                console.error("Login failed:", message);
            }
        } else {
            toast.error( "An unexpected error occured.", { position: 'top-right'})
            console.error("Unexpected error:", resultAction.error.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className={`w-full bg-customGreen text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-customGreen focus:ring-opacity-50 ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>

            <ToastContainer />
        </div>
    );
}

export default AdminLogin;
