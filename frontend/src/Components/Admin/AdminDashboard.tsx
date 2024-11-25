import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardDetails } from "../../Redux/Store/Slices/adminSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error, totalUsers, totalAppointments, totalRevenue, totalTherapists } = useSelector((state: RootState) => state.admin);


  const revenueData = [
    { id: 1, name: 'January', revenue: 100 },
    { id: 2, name: 'February', revenue: 200 },
    { id: 3, name: 'March', revenue: 500 },
    { id: 4, name: 'April', revenue: totalRevenue || 0 },
    { id: 5, name: 'May', revenue: 100 }
  ]

  useEffect(() => {
    console.log('Admin Dashboard Rendered');
    dispatch(fetchDashboardDetails())
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      
      {/* Grid Layout for Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Total Revenue</h2>
          <p className="text-2xl mt-4">₹{totalRevenue}</p>
        </div>

        {/* Total Users */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-2xl mt-4">{totalUsers}</p>
        </div>

        {/* Total Therapists */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Total Therapists</h2>
          <p className="text-2xl mt-4">{totalTherapists}</p>
        </div>

        {/* Total Sessions */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Total Sessions</h2>
          <p className="text-2xl mt-4">{totalAppointments}</p>
        </div>
      </div>

    {/*  Revenue Chart */}
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Revenue Chart</h2>
        <ResponsiveContainer width="50%" height={400}>
            <BarChart
            width={100}
            height={50}
            data={revenueData}
            margin={{ top:20, right: 30, left: 20, bottom: 5}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#82ca9d" key="revenue-bar" />
            </BarChart>
        </ResponsiveContainer>
    </div>

    </div>
  );
};

export default AdminDashboard;
