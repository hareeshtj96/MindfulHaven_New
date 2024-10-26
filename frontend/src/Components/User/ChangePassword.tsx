import React, {useState} from "react";
import { changePassword } from "../../Redux/Store/Slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    const dispatch: AppDispatch = useDispatch()

    const user = useSelector((state: RootState) => state.user.user);
    const email = user?.email;
   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            console.error("Email is not defined");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match");
            toast.error("New password and confirm password do not match.")
            return;
        }

        try {
            await dispatch(changePassword({ email, currentPassword, newPassword, confirmPassword })).unwrap();
    
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (error: any) {
            console.error("Error caught in handleSubmit:", error);
            const errorMessage = error || "Failed to change password";
    
            // Display the error message
            toast.error(errorMessage);
        }
       
    }
    
    return (
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Change Password</h2>
            <form className="bg-white shadow-md rounded px-6 sm:px-8 py-6 sm:pb-8 mb-4" onSubmit={handleSubmit}>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
               

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm sm:text-base font-bold mb-2" htmlFor="currentPassword">
                        Current Password
                    </label>
                    <input 
                        id="currentPassword"
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter current password"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm  sm:text-base font-bold mb-2" htmlFor="newPassword">
                        New Password
                    </label>
                    <input 
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter new password"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm sm:text-base font-bold mb-2" htmlFor="confirmPassword">
                        Confirm New Password
                    </label>
                    <input 
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Confirm new password"
                        required
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Change Password
                    </button>
                </div>
            </form>

            <ToastContainer />
        </div>
    )
}

export default ChangePassword