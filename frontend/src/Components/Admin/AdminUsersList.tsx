import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../Redux/Store/Slices/adminSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";


interface User {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    isBlocked: boolean;
}

const AdminUsersList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    
    
    const { users, loading, error } = useSelector((state: RootState) => state.admin);
    

    const [userData, setUserData] = useState<User[]>([]);

    useEffect(() => {
        if (users && users.length > 0) {
            setUserData(users);
        }
    }, [users]); 

    
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

 
    console.log("User Data for frontend:", userData);

    // Handling loading and error states
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    if (!users || users.length === 0) {
        return <p>No users found.</p>;
    }

  
    return (
        <div className="flex justify-center items-top min-h-screen bg-gray-100">
            <div className="w-full max-w-4xl">
                <h1 className="text-2xl font-bold text-center mb-6">Users List</h1>
                <table className="w-full table-auto bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left font-bold">Name</th>
                            <th className="px-4 py-2 text-left font-bold">Email</th>
                            <th className="px-4 py-2 text-left font-bold">Mobile</th>
                            <th className="px-4 py-2 text-left font-bold">Blocked Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2">{user.name}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                                <td className="border px-4 py-2">{user.mobile}</td>
                                <td className="border px-4 py-2">
                                    {user.isBlocked ? "Blocked" : "Active"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersList;
