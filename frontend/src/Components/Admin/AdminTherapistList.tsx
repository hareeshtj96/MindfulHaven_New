import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTherapists } from "../../Redux/Store/Slices/adminSlice";
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
    const navigate = useNavigate();
    
    
    const { therapists, loading, error, totalPages } = useSelector((state: RootState) => state.admin);
    

    const [therapistData, setTherapistData] = useState<Therapist[]>([]);
    const [selectedTherapist, setSelectedTherapist] = useState<Therapist | string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    


    useEffect(() => {
        if (therapists && therapists.length > 0) {
            setTherapistData(therapists);
        }
    }, [therapists]); 

    
    useEffect(() => {
        dispatch(fetchTherapists({ page: currentPage, limit:2}))
            .then((result) => {
                const data = unwrapResult(result);
                setTherapistData(data.therapists);
            })
            .catch((err) => console.log(err));
    }, [dispatch, currentPage]);

    const handleShowDetails = (therapist: Therapist) => {
        navigate(`/admin/admin_getTherapistDetails/${therapist._id}`)
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    }


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
                                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                onClick={() => handleShowDetails(therapist)}
                                >Show Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <p>Page {currentPage} of {totalPages}</p>
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
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

export default AdminTherapistList;
