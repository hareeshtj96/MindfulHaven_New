import React, { useState, useEffect } from "react";
import familyImg from "../../../Public/banner/family_therapy.jpg";
import individualImg from "../../../Public/banner/individual_therapy.jpg"
import childImg from '../../../Public/banner/child_therapy.jpg'
import coupleImg from '../../../Public/banner/couple_therapy.jpg'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/Store/store"
import { fetchTherapistBySearchTerm, resetSearchResults, geminiAPIResponse, resetResult } from "../../Redux/Store/Slices/userSlice";

function Dashboard() {
    const [activeIndex, setActiveIndex] = useState(null);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { therapists, status, error, search_Result } = useSelector((state: RootState) => state.user);

    const stateIss = useSelector((state: RootState) => state.user)
    console.log("state is....dashboard", stateIss)

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    // Effect to reset therapist when component mounts
    useEffect(() => {
        dispatch(resetSearchResults())
    }, [dispatch]);

    //debounce effect
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            dispatch(fetchTherapistBySearchTerm(debouncedSearchTerm))
        }
    }, [debouncedSearchTerm, dispatch]);


    // geminiAPIResponse
    useEffect(() => {
        if (debouncedSearchTerm) {
            dispatch(geminiAPIResponse(debouncedSearchTerm));
            setHasSearched(true);
        }
    },[debouncedSearchTerm, dispatch]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            dispatch(resetResult())
        }
    }, [searchTerm, dispatch]);


    const toggleFAQ = (index: any) => {
        setActiveIndex(activeIndex === index ? null : index);
    }

    const handleBookAppointment = (therapistId: string) => {
        console.log("Booking appointment for therapist ID:", therapistId);
        navigate(`/slot_management/${therapistId}`);
    };

    const goToChildTherapy = () => {
        navigate('/childTherapy');
    }

    return (
        <div className="p-6">
            <section className="mb-16">
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <p>Manage your sessions here</p>
            </section>

            <div className="mb-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search therapists by name or specialization..."
                    className="p-2 border border-gray-300 rounded-lg w-full  sm:w-96" />

                <button
                    onClick={() => {
                        setHasSearched(true);
                        dispatch(fetchTherapistBySearchTerm(debouncedSearchTerm))
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
                >
                    Search
                </button>
            </div>





            <section className="mb-8">

                <div className="space-y-4">
                    {hasSearched  &&  therapists.length === 0 ? (
                        <div className="text-center text-gray-700">
                            <p>No therapists found based on your search criteria. Please try a different term.</p>
                        </div>
                    ) : (
                        <>
                            {hasSearched && (
                                <h2 className="text-2xl font-bold text-center">Therapists Available</h2>
                            )}
                            {Array.isArray(therapists) && therapists.map((therapist) => (
                                <div key={therapist._id} className="flex bg-white rounded-lg shadow-md p-4 space-y-4 md:space-y-0">
                                    <div className="flex flex-col items-center justify-center p-4">
                                        {therapist.photo ? (
                                            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                                                <img
                                                    src={`http://mindfulhaven.life/api/uploads/${therapist.photo.replace(/\\/g, "/")}`}
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
                            ))}
                        </>
                    )}
                </div>


            </section>



            <section className="mb-16">
                <h2 className="text-2xl font-bold">Select your therapy</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <img src={familyImg} alt="image1" className="w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
                                Family Therapy
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <img src={individualImg} alt="image2" className="w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
                                Individual Therapy
                            </span>
                        </div>
                    </div>

                    <div className="relative" onClick={goToChildTherapy}>
                        <img src={childImg} alt="image3" className="w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
                                Child Therapy
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <img src={coupleImg} alt="image4" className="w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
                                Couple Therapy
                            </span>
                        </div>
                    </div>
                </div>
            </section>




            <section className="mb-8">
                <h2 className="text-2xl font-bold text-center">MindfulHaven FAQs</h2>

                <div className="mb-4 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-2">
                    
                    <input type="text" placeholder="Search anything related to Mental Health and Wellness"
                    className="p-4 border border-gray-300 rounded-lg w-full sm:w-[500px]" value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="bg-btncolor text-white p-4 rounded-lg hover:bg-btncolor-dark w-full sm:w-auto"
                    onClick={() => dispatch(geminiAPIResponse(searchTerm))}
                    >Search</button>
                   
                </div>

                {search_Result && (
                <div className="result bg-gray-100 p-4 rounded-lg shadow-md mt-4 max-w-full sm:max-w-lg mx-auto">
                    <h3 className="text-lg font-semibold">Search Result:</h3>
                    <p className="mt-2 text-gray-700">
                        {typeof search_Result === "string" ? search_Result : JSON.stringify(search_Result)}
                    </p>
                </div>
                 )}

                <ul className="list-none pl-0 mt-4 flex flex-col items-center mx-auto space-y-4 max-w-full sm:max-w-lg">
                    {[
                        {
                            question: "How many times per month can I see my therapists?",
                            answer: "You can see your therapist up to 4 times per month depending on your subscription plan"
                        },
                        {
                            question: "Does MindfulHaven provide family therapy?",
                            answer: "Yes, MindfulHaven offers a range of therapies including family therapy"
                        },
                        {
                            question: "What if I don't like the therapists?",
                            answer: "You can choose a different therapist at any time through your dashboard"
                        }
                    ].map((faq, index) => (
                        <li key={index} className="w-full">
                            <button className="w-full text-left text-lg font-semibold focus:outline-none p-2 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => toggleFAQ(index)}>{faq.question}

                            </button>
                            {activeIndex === index && (
                                <p className="mt-2 pl-4 text-gray-700">{faq.answer}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </section>


        </div>
    )
}

export default Dashboard;