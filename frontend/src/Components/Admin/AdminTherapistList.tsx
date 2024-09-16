import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapists, getTherapistVerified } from "../../Redux/Store/Slices/adminSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { unwrapResult } from "@reduxjs/toolkit";



interface Therapist {
    _id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    isVerified: boolean;
}

const AdminTherapistList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    
    
    const { therapists, loading, error } = useSelector((state: RootState) => state.admin);
    

    const [therapistData, setTherapistData] = useState<Therapist[]>([]);

    useEffect(() => {
        if (therapists && therapists.length > 0) {
            setTherapistData(therapists);
        }
    }, [therapists]); 

    
    useEffect(() => {
        dispatch(fetchTherapists());
    }, [dispatch]);

    const handleVerify = async ( therapistId: string, isVerified: boolean) => {
        try {
            const resultAction = await dispatch(getTherapistVerified(therapistId));
            unwrapResult(resultAction);

            //update therapist's verified status in local state
            setTherapistData((prevData) => 
                prevData.map((therapist) => 
                    therapist._id === therapistId
                    ? {...therapist, isVerified: !isVerified}
                : therapist));
        } catch (error) {
            console.error("Verification failed:", error);
        }
    }
   
    console.log("Therapist Data for frontend:", therapistData);

    // Handling loading and error states
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    if (!therapists || therapists.length === 0) {
        return <p>No therapists found.</p>;
    }

  
    return (
        <div className="flex justify-center items-top min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl">
            <h1 className="text-2xl font-bold text-center mb-6">Therapist List</h1>
            <table className="w-full table-auto bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-left font-bold">Name</th>
                        <th className="px-4 py-2 text-left font-bold">Email</th>
                        <th className="px-4 py-2 text-left font-bold">Phone</th>
                        <th className="px-4 py-2 text-left font-bold">Specialization</th>
                        <th className="px-4 py-2 text-left font-bold">Verification</th>
                        <th className="px-4 py-2 text-left font-bold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {therapistData.map((therapist) => (
                        <tr key={therapist._id} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{therapist.name}</td>
                            <td className="border px-4 py-2">{therapist.email}</td>
                            <td className="border px-4 py-2">{therapist.phone}</td>
                            <td className="border px-4 py-2">{therapist.specialization}</td>
                            <td className="border px-4 py-2">
                                    {therapist.isVerified ? "Verified" : "Not Verified"}
                                </td>
                            <td className="border px-4 py-2">
                            <button
                    className={`px-4 py-2 rounded text-white ${
                        therapist.isVerified
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() => handleVerify(therapist._id, therapist.isVerified)}
                >
                    {therapist.isVerified ? "Unverify" : "Verify"}
                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default AdminTherapistList;
