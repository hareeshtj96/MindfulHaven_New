import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { fetchProfile } from "../../Redux/Store/Slices/therapistSlice";


const dayMap: { [key: number]: string} = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
}

const TherapistProfileView = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const therapistData22 = useSelector((state: RootState) => state.therapist);
    console.log("therapist 22:", therapistData22);

    // Select the array of therapist data
    const currentTherapist = useSelector((state: RootState) => state.therapist.currentTherapist);
    const loading = useSelector((state: RootState) => state.therapist.loading);
    const error = useSelector((state: RootState) => state.therapist.error);

    useEffect(() => {
        const therapistId = localStorage.getItem("therapistId");
        if(!therapistId) {
            navigate("/therapist/therapist_login")
        } else {
            dispatch(fetchProfile());
        }
       
    }, [dispatch, navigate]);



    const therapist = currentTherapist
    console.log("therapist data :", therapist);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!therapist) {
        return <div>No profile data available</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-xl mb-4 text-center">Your Profile Details</h2>

            <div className="flex flex-col items-center">
                {therapist.photo ? (
                    <img 
                        src={`https://mindfulhaven.life/api/uploads/${therapist.photo.replace(/\\/g, "/")}`}
                        alt="Therapist" 
                        className="w-32 h-32 rounded-full mb-4" 
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        No Photo
                    </div>
                )}
            </div>

            {/* Two columns layout for personal and professional details */}
            <div className="grid grid-cols-2 gap-64 mt-12">
                {/* Personal Details */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                    <p className="mb-2">
                        <strong>Name:</strong> {therapist.name}
                    </p>
                    <p className="mb-2">
                        <strong>Phone:</strong> {therapist.phone}
                    </p>
                    <p className="mb-2">
                        <strong>Specialization:</strong> {therapist.specialization}
                    </p>
                    <p className="mb-2">
                        <strong>Gender:</strong> {therapist.gender}
                    </p>
                    <p className="mb-2">
                        <strong>Educational Qualifications:</strong> {therapist.educationalQualifications}
                    </p>
                </div>

                {/* Professional Details */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Professional Details</h3>
                    <p className="mb-2">
                        <strong>Counselling Qualification:</strong> {therapist.counsellingQualification}
                    </p>
                    <p className="mb-2">
                        <strong>Professional Experience:</strong> {therapist.professionalExperience} years
                    </p>
                    <p className="mb-2">
                        <strong>Establishment:</strong> {therapist.establishment}
                    </p>
                    <p className="mb-2">
                        <strong>Location:</strong> {therapist.location}
                    </p>
                    <p className="mb-2">
                        <strong>Timings:</strong> 
                        {therapist.timings && therapist.timings.length > 0 ? (
                            <ul>
                                {therapist.timings.map((timing, index) => (
                                    <li key={index}>
                                        {dayMap[timing.dayOfWeek]}: {timing.startTime} - {timing.endTime}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            "No timings available"
                        )}
                    </p>
                    <p className="mb-2">
                        <strong>Fees:</strong> ₹{therapist.fees}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TherapistProfileView;
