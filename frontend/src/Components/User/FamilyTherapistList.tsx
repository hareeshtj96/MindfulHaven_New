import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../Redux/Store/store";
import {
    fetchFamilyTherapist,
    fetchSortedFamilyTherapists,
    fetchFamilyTherapistBySearchTerm,
} from "../../Redux/Store/Slices/userSlice";
import DefaultSkeleton from "../../Components/MaterialUI/Shimmer";

const FamilyTherapistList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { familyTherapists, totalPages, currentPage, sortedFamilyTherapists, status, error, } = useSelector(
        (state: RootState) => state.user
    );

    

    const state = useSelector((state: RootState) => state.user);
    console.log("state is..........", state )

    const [sortOption, setSortOption] = useState<string>("experience");
    const [genderFilter, setGenderFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const [therapistsPerPage] = useState<number>(5);

    // Fetch all therapists on mount
    useEffect(() => {
        dispatch(fetchFamilyTherapist({ page: currentPage, limit: therapistsPerPage }));
    }, [dispatch, currentPage, therapistsPerPage]);

     
    const getTotalPages = () => totalPages || 1;


    // Fetch sorted therapists based on sort option
    useEffect(() => {
        dispatch(fetchSortedFamilyTherapists(sortOption));
    }, [dispatch, sortOption]);

    // Debounce search input
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    // Fetch child therapists based on the search term
    useEffect(() => {
        if (debouncedSearchTerm) {
            setHasSearched(true);
            dispatch(fetchFamilyTherapistBySearchTerm(debouncedSearchTerm));
        } else {
            setHasSearched(false);
        }
    }, [debouncedSearchTerm, dispatch]);

    // Filter therapists based on selected gender
    const filteredTherapists = genderFilter === "all"
        ? sortedFamilyTherapists
        : sortedFamilyTherapists.filter((therapist) => therapist.gender === genderFilter);

    console.log("filtered therapists:", filteredTherapists);

    const handleBookAppointment = (therapistId: string) => {
        navigate(`/slot_management/${therapistId}`);
    };

    if (status === "loading") {
        return (
            <div className="p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-6">Therapists List</h1>
                <DefaultSkeleton />
            </div>
        );
    }

    if (status === "failed") {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Therapists List</h1>

            {/* Search bar */}
            <div className="mb-4 flex items-center space-x-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search therapists by specialization"
                    className="p-2 border border-gray-300 rounded-lg w-96"
                />
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ml-auto">
                    Search
                </button>
            </div>

            {/* Display search results */}
            {hasSearched && familyTherapists.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Search Results:</h2>
                    {familyTherapists.map((therapist) => (
                        <div key={therapist._id} className="flex bg-white rounded-lg shadow-md p-4 mt-2">
                            <div className="flex flex-col items-center justify-center p-4">
                                {therapist.photo ? (
                                    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                                        <img
                                            src={therapist.photo}
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
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {therapist.name}
                                </h2>
                                <p className="text-gray-700">
                                    <strong>Email:</strong>{" "}
                                    <span className="pl-2">{therapist.email}</span>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Mobile:</strong>{" "}
                                    <span className="pl-2">{therapist.phone}</span>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Specialization:</strong>{" "}
                                    <span className="pl-2">{therapist.specialization}</span>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Experience:</strong>{" "}
                                    <span>{therapist.professionalExperience} years</span>
                                </p>
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
                    ))}
                </div>
            )}

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

            {/* Therapist List */}
            <div className="space-y-4">
                {!hasSearched && (!familyTherapists|| familyTherapists.length === 0) ? (
                    <div className="text-center text-gray-700">
                        <p>No therapists found based on your criteria. Please try a different term.</p>
                    </div>
                ) : (
                    (filteredTherapists || [] ).map((therapist) => (
                        <div key={therapist._id} className="flex bg-white rounded-lg shadow-md p-4">
                            <div className="flex flex-col items-center justify-center p-4">
                                {therapist.photo ? (
                                    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                                        <img
                                            src={therapist.photo}
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
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {therapist.name}
                                </h2>
                                <p className="text-gray-700">
                                    <strong>Email:</strong>{" "}
                                    <span className="pl-2">{therapist.email}</span>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Mobile:</strong>{" "}
                                    <span className="pl-2">{therapist.phone}</span>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Specialization:</strong>{" "}
                                    <span className="pl-2">{therapist.specialization}</span>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Experience:</strong>{" "}
                                    <span>{therapist.professionalExperience} years</span>
                                </p>
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
                )}
            </div>

                
        </div>
    );
};

export default FamilyTherapistList;
