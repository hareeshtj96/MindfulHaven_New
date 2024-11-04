import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { fetchTherapistDetails, getTherapistVerified } from "../../Redux/Store/Slices/adminSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Therapist } from "../../Redux/Store/Slices/adminSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminTherapistDetails = () => {
    const { therapistId } = useParams<{ therapistId: string }>();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

   
    const { selectedTherapist, loading, error } = useSelector((state: RootState) => state.admin);
    const [therapistData, setTherapistData] = useState<Therapist | null>(null);

    useEffect(() => {
        if (therapistId) {
            dispatch(fetchTherapistDetails(therapistId))
            .then(unwrapResult)
            .then((therapist) => setTherapistData(therapist))
            .catch(console.error);  
        }
    }, [dispatch, therapistId]);

    const handleVerify = async ( therapistId: string, isVerified: boolean) => {
        try {
            const resultAction = await dispatch(getTherapistVerified(therapistId));
            unwrapResult(resultAction);

            if (therapistData) {
                setTherapistData({
                    ...therapistData,
                    isVerified: !isVerified,
                });
            }

            if (!isVerified) {
                toast.success("Successfully verified!")
            } else {
                toast.success("Successfully unverified")
            }
            setTimeout(() => {
                navigate("/admin/admin_getTherapist");
            }, 2000);
            
        } catch (error) {
            console.error("Verification failed:", error);
            toast.error("Verification failed, please try again");
        }
    }

    // Handle loading and error states
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

   
    if (!therapistData || !selectedTherapist ) return <p>No therapist found.</p>;

    return (
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-4xl">
                    <h1 className="text-2xl font-bold text-center mb-6">Therapist Details</h1>
                    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                    <div className="flex flex-col items-center justify-center p-4">
                            {selectedTherapist.photo ? (
                                <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                                    <img 
                                        src={`http://mindfulhaven.life/api/uploads/${selectedTherapist.photo.replace(/\\/g, "/")}`}
                                        alt={selectedTherapist.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                    No Photo
                                </div>
                            )}
                        </div>
                       
                        <p className="text-lg mb-4">
                            <strong className="pr-2">Name: </strong> {selectedTherapist.name}
                        </p>
                        <p className="text-lg mb-4">
                            <strong className="pr-2">Email:</strong> {selectedTherapist.email}
                        </p>
                        <p className="text-lg mb-4">
                            <strong className="pr-2">Phone:</strong> {selectedTherapist.phone}
                        </p>
                        <p className="text-lg mb-4">
                            <strong className="pr-2">Specialization:</strong> {selectedTherapist.specialization}
                        </p>
                        <p className="text-lg mb-4">
                            <strong className="pr-2">Gender:</strong> {selectedTherapist.gender}
                        </p>
                        <p className="text-lg mb-4">
                            <strong className="pr-2">Location:</strong> {selectedTherapist.location}
                        </p>
                        <p className="text-lg mb-4">
                            <strong className="pr-2">Professional Experience:</strong> {selectedTherapist.professionalExperience} years
                        </p>
                        <p className="text-lg mb-4">
                         <strong className="pr-2">Identity Proof:</strong> 
                            {selectedTherapist.identityProof ? (
                             <a 
                                href={`http://mindfulhaven.life/api/uploads/${selectedTherapist.identityProof.replace(/\\/g, "/")}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 underline"
                            >
                             Verify Identity Proof
                            </a>
                        ) : (
                            "Not provided"
                            )}
                        </p>

                        <p className="text-lg mb-4">
                            <strong className="pr-2">Establishment:</strong> {selectedTherapist.establishment}
                        </p>
                        <p className="text-lg mb-4">
                            <strong className="pr-2">Fees:</strong> ₹{selectedTherapist.fees}
                        </p>
                        <p className="text-lg mb-4">
                            <strong className="pr-2">Counseling Qualification:</strong> {selectedTherapist.counsellingQualification}
                        </p>
                        <p className="text-lg mb-4">
                            <strong className="pr-2">Educational Qualifications:</strong> {selectedTherapist.educationalQualifications}
                        </p>

                        {/* Add the verification toggle button */}
                        <button
                            className={`px-4 py-2 rounded text-white ${
                                selectedTherapist.isVerified
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-500 hover:bg-green-600"
                            }`}
                            onClick={() => handleVerify(therapistData._id, therapistData.isVerified)}
                >
                    {therapistData.isVerified ? "Unverify" : "Verify"}
                        </button>
                       
                    </div>
                </div>
                <ToastContainer />
            </div>
    );
};

export default AdminTherapistDetails;
