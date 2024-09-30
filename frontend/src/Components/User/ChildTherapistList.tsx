import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../Redux/Store/store";
import { fetchChildTherapist, fetchSortedChildTherapists } from "../../Redux/Store/Slices/userSlice";
import DefaultSkeleton from '../../Components/MaterialUI/Shimmer';

const ChildTherapistList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { therapists, sortedTherapists, status, error } = useSelector((state: RootState) => state.user);

    const [sortOption, setSortOption] = useState<string>("experience");
    const [genderFilter, setGenderFilter] = useState<string>("all");

    useEffect(() => {
        dispatch(fetchChildTherapist());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchSortedChildTherapists(sortOption));
    }, [dispatch, sortOption]);

    if (status === 'loading') {
        return (
            <div className="p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-6">Therapists List</h1>
                <DefaultSkeleton />
            </div>
        );
    }

    if (status === 'failed') {
        return <p>Error: {error}</p>;
    }

    if (!therapists || therapists.length === 0) {
        return <p>No therapists available</p>;
    }

    // Filter therapists based on selected gender
    const filteredTherapists = genderFilter === "all"
        ? sortedTherapists
        : sortedTherapists.filter(therapist => therapist.gender === genderFilter);

    const handleBookAppointment = (therapistId: string) => {
        console.log("Booking appointment for therapist ID:", therapistId);
        navigate(`/slot_management/${therapistId}`);
    };

    return (
        <div className="p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Therapists List</h1>

            {/* Sort By Dropdown */}
            <div className="mb-4">
                <label className="mr-2 text-lg font-semibold">Sort By:</label>
                <select
                    className="p-2 border border-gray-300 rounded"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)} 
                >
                    <option value="experience">Experience</option>
                    <option value="name">Name</option>
                </select>
            </div>

            {/* Gender Filter Dropdown */}
            <div className="mb-4">
                <label className="mr-2 text-lg font-semibold">Filter by Gender:</label>
                <select
                    className="p-2 border border-gray-300 rounded"
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)} 
                >
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div className="space-y-4">
                {/* Use filteredTherapists instead of sortedTherapists */}
                {filteredTherapists && filteredTherapists.length > 0 ? (
                    filteredTherapists.map((therapist) => (
                        <div key={therapist._id} className="flex bg-white rounded-lg shadow-md p-4">
                            <div className="flex flex-col items-center justify-center p-4">
                                {therapist.photo ? (
                                    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                                        <img
                                            src={`http://localhost:8080/uploads/${therapist.photo.replace(/\\/g, "/")}`}
                                            alt={therapist.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                        No Photo
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex flex-col justify-center flex-grow space-y-2">
                                <h2 className="text-xl font-semibold text-gray-900">{therapist.name}</h2>
                                <p className="text-gray-700"><strong>Email:</strong> <span className="pl-2">{therapist.email}</span></p>
                                <p className="text-gray-700"><strong>Mobile:</strong> <span className="pl-2">{therapist.phone}</span></p>
                                <p className="text-gray-700"><strong>Specialization:</strong> <span className="pl-2">{therapist.specialization}</span></p>
                                <p className="text-gray-700"><strong>Experience:</strong> <span>{therapist.professionalExperience} years</span></p>
                            </div>

                            <div className="flex items-center justify-end">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                    onClick={() => handleBookAppointment(therapist._id)}
                                >
                                    Book an Appointment
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No sorted therapists available</p>
                )}
            </div>
        </div>
    );
};

export default ChildTherapistList;
