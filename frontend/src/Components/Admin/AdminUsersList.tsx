import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleUserBlockStatus } from "../../Redux/Store/Slices/adminSlice"; 
import { logoutUser } from "../../Redux/Store/Slices/userSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { unwrapResult } from "@reduxjs/toolkit"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  const currentUserId = useSelector((state: RootState) => state.user.user?.userId);
  

  useEffect(() => {
    if (users && users.length > 0) {
      setUserData(users);
    }
  }, [users]);

  useEffect(() => {
    dispatch(fetchUsers());  
  }, [dispatch]);

  const handleBlockToggle = async (userId: string, isBlocked: boolean, currentUserId: string) => {
    const action = isBlocked ? "unblock" : "block";
    const newBlockedState = !isBlocked;
    console.log("newBlocked state:", newBlockedState);
    console.log("currentUserId (logged-in user):", currentUserId);
    
     
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to {action} this user?</p>
          <div className="mt-4">
            <button
              onClick={async () => {
                try {
                  
                  const resultAction = await dispatch(toggleUserBlockStatus({ userId, isBlocked: newBlockedState }));
                  console.log("result action:", resultAction);
                  
                  unwrapResult(resultAction); 

                  // Update local state to reflect the change immediately
                  setUserData((prevData) =>
                    prevData.map((user) =>
                      user._id === userId ? { ...user, isBlocked: newBlockedState } : user
                    )
                  );

                  if (newBlockedState && userId === currentUserId ) {
                    console.log("dispatching logout....");
                    
                    dispatch(logoutUser());
                  }

                  toast.success(`User successfully ${action}ed.`);
                  
                  

                } catch (error) {
                  console.error(`Failed to ${action} the user:`, error);
                  toast.error(`Failed to ${action} the user.`);
                }
                closeToast(); 
              }}
              className="mr-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              Confirm
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false, 
        draggable: false, 
      }
    )
  };

  const totalItems = userData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = userData.slice(startIndex, startIndex + itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage (currentPage - 1)
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!users || users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <div className="flex justify-center items-top min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-6">Users List</h1>
        <table className="w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left font-bold">Name</th>
              <th className="px-4 py-2 text-left font-bold">Email</th>
              <th className="px-4 py-2 text-left font-bold">Mobile</th>
              <th className="px-4 py-2 text-left font-bold">Blocked Status</th>
              <th className="px-4 py-2 text-left font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.mobile}</td>
                <td className="border px-4 py-2">{user.isBlocked ? "Blocked" : "Active"}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleBlockToggle(user._id, user.isBlocked, currentUserId || "")}
                    className={`px-4 py-2 rounded-md text-white ${
                      user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-300 hover:bg-gray-400 text-white"
          }`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          >
            Previous
          </button>
          <p className="text-lg font-medium">
            Page <span className="text-gray-600">{currentPage}</span> of {" "}
            <span className="text-gray-600">{totalPages}</span>
          </p>

          <button
          className={`px-4 py-2 rounded -md ${
            currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-300 hover:bg-gray-400 text-white"
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default AdminUsersList;
