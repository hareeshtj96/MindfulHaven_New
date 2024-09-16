import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/Store/store";
import { fetchChildTherapist } from "../../Redux/Store/Slices/userSlice";

const ChildTherapistList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { therapists, status, error } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchChildTherapist());
    }, [dispatch]);

    // Handle loading state
    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    // Handle error state
    if (status === 'failed') {
        return <p>Error: {error}</p>;
    }

  
    if (!therapists || therapists.length === 0) {
        return <p>No therapists available</p>;
    }

    const therapistItems: JSX.Element[] = [];
    for (let i = 0; i < therapists.length; i++) {
        therapistItems.push(
            <div key={therapists[i].id} className="flex bg-white rounded-lg shadow-md overflow-hidden w-full md:w-[700px] p-4 mb-4">
               
                <div className="flex flex-col items-center justify-center p-4">
                    {therapists[i].photo ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                            <img 
                                src={`http://localhost:8080/uploads/${therapists[i].photo.replace(/\\/g, "/")}`}
                                alt="Therapist" 
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
                    <h2 className="text-xl font-semibold text-gray-900">{therapists[i].name}</h2>
                    <p className="text-gray-700"><strong>Email:</strong> <span className="pl-2">{therapists[i].email}</span></p>
                    <p className="text-gray-700"><strong>Mobile:</strong> <span className="pl-2">{therapists[i].phone}</span></p>
                    <p className="text-gray-700"><strong>Specialization:</strong> <span className="pl-2">{therapists[i].specialization}</span></p>
                    <p className="text-gray-700"><strong>Experience:</strong> <span>{therapists[i].professionalExperience}</span></p>
                </div>

                <div className="flex items-center justify-end">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        Book an Appointment
                    </button>
                </div>
            </div>
        );
    }
    

    return (
        <div className="p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Therapists List</h1>
            <div className="space-y-4">
                {therapistItems}
            </div>
        </div>
    );
};

export default ChildTherapistList;
