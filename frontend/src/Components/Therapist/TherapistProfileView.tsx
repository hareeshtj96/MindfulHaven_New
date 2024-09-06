import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store/store";

const TherapistProfileView = () => {
    const therapist = useSelector((state: RootState) => state.therapist.therapist);

    if(!therapist) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-xl mb-4 text-center">Your Profile Details</h2>

            <div className="flex flex-col items-center">
                {therapist.photo ? (
                    <img 
                    src={`/${therapist.photo}`} 
                    alt="Therapist" 
                    className="w-32 h-32 rounded-full mb-4" />
                ): (
                    <div className="w-32 h-32 rounded-full by-gray-200 flex items-center justify-center mb-4">No Photo</div>
                
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <h3 className="text-lg font-semibold">Personal Details</h3>
                    <p><strong>Name:</strong>{therapist.name}</p>
                    <p><strong>Phone:</strong>{therapist.phone}</p>
                    <p><strong>Specialization:</strong>{therapist.specialization}</p>
                    <p><strong>Gender:</strong>{therapist.gender}</p>
                    <p><strong>Educational Qualifications:</strong>{therapist.educationalQualifications}</p>
                </div>

                <div className="col-span-2">
                    <h3 className="text-lg font-semibold">Professional Detals</h3>
                    <p><strong>Counselling Qualification:</strong>{therapist.counsellingQualification}</p>
                    <p><strong>Professional Experience:</strong>{therapist.professionalExperience}</p>
                    <p><strong>Establishment:</strong>{therapist.establishment}</p>
                    <p><strong>Location:</strong>{therapist.location}</p>
                    <p><strong>Timings:</strong>{therapist.timings}</p>
                    <p><strong>Fees:</strong>₹{therapist.fees}</p>
                </div>
            </div>

        </div>
    )
}

export default TherapistProfileView;