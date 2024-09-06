import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateTherapistDetails } from "../../Redux/Store/Slices/therapistSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const TherapistDetails = () => {
    const navigate = useLocation();
    const therapist = useSelector((state: RootState) => state.therapist.therapist)
    const dispatch: AppDispatch = useDispatch();
    const [name, setName] = useState<string>('');
    // const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [specialization, setSpecialization] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [educationalQualifications, setEducationalQualifications] = useState<string>('');
    const [identityProof, setIdentityProof] = useState<File | null>(null);
    const [counsellingQualification, setCounsellingQualification] = useState<string>('');
    const [professionalExperience, setProfessionalExperience] = useState<string>('');
    const [establishment, setEstablishment] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [timings, setTimings] = useState<string>('');
    const [fees, setFees] = useState<number | ''>('');
    const [photoBase64, setPhotoBase64] = useState<File | null>(null);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
            setPhotoBase64(file);
            setIdentityProof(file);
        }
    };


    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if(!name) newErrors.name = "Name is required";
        if(!phone) newErrors.phone = "Phone number is required";
        if(!specialization) newErrors.specialization = "Specialization is required";
        if(!gender) newErrors.gender = "Gender is required";
        if(!educationalQualifications) newErrors.educationalQualifications = "Educational qualifications are required";
        if(!identityProof) newErrors.identityProof = "Identity Proof (file) is required";
        if(!counsellingQualification) newErrors.counsellingQualification = "Counselling qualification is reqired";
        if(!professionalExperience) newErrors.professionalExperience = "Professional experience is required";
        if(!establishment) newErrors.establishment = "Establishment is required";
        if(!location) newErrors.location = "Location is required";
        if(!timings) newErrors.timings = "Timings are required";
        if(fees === ""){
            newErrors.fees = "Fees is required";
        } else if (fees <= 0) {
            newErrors.fees = "Fees must be a positive number";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!validateForm()) {
            toast.error("Please fill out the required fields");
            return;
        }

        const formData = new FormData();

        const updatedTherapistData = {
            therapistId: therapist?.therapistId || "default_id",
            name,
            phone,
            specialization,
            gender,
            educationalQualifications,
            identityProof,
            counsellingQualification,
            professionalExperience,
            establishment,
            location,
            timings,
            fees,
        };

        formData.append('therapistData', JSON.stringify(updatedTherapistData));

        if(photoBase64) {
            formData.append('photo', photoBase64)
        }

        if(identityProof) {
            formData.append('identityProof', identityProof);
        }

        try {
            await dispatch(updateTherapistDetails(formData)).unwrap();

            toast.success("Therapist details updated successfully!");
                      
            setTimeout(() => {
                window.location.reload();
            },2000);
        } catch (error) {
            toast.error("Failed to update therapist details. Please try again.")
        }
        
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-xl mb-4 text-center">Let's build your dedicated Profile</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              
                <div className="col-span-2">
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        id="phone"
                        placeholder="Enter your phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        id="specialization"
                        placeholder="Enter your specialization"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.specialization && <p className="text-red-500">{errors.specialization}</p>}
                </div>

                <div>
                    <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500">{errors.gender}</p>}
                </div>

                <div className="col-span-2">
                    <input
                        type="text"
                        id="educationalQualifications"
                        placeholder="Enter your educational qualification"
                        value={educationalQualifications}
                        onChange={(e) => setEducationalQualifications(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.educationalQualifications && <p className="text-red-500">{errors.educationalQualifications}</p>}
                </div>


                <div className="col-span-2">
                    <label htmlFor="identityProof" className="block">Upload your Identity Proof</label>
                    <input
                        type="file"
                        id="identityProof"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.identityProof && <p className="text-red-500">{errors.identityProof}</p>}
                </div>

                <div className="col-span-2">
                    <input
                        type="text"
                        id="counsellingQualification"
                        placeholder="Enter your counselling qualification"
                        value={counsellingQualification}
                        onChange={(e) => setCounsellingQualification(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.counsellingQualification && <p className="text-red-500">{errors.counsellingQualification}</p>}
                </div>

                <div className="col-span-2">
                    <input
                        type="text"
                        id="professionalExperience"
                        placeholder="Enter your professional experience"
                        value={professionalExperience}
                        onChange={(e) => setProfessionalExperience(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.professionalExperience && <p className="text-red-500">{errors.professionalExperience}</p>}
                </div>

                <div className="col-span-2">
                    <input
                        type="text"
                        id="establishment"
                        placeholder="Enter your establishment"
                        value={establishment}
                        onChange={(e) => setEstablishment(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.establishment && <p className="text-red-500">{errors.establishment}</p>}
                </div>

                <div className="col-span-2">
                    <input
                        type="text"
                        id="location"
                        placeholder="Enter your location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.location && <p className="text-red-500">{errors.location}</p>}
                </div>

                <div className="col-span-2">
                    <input
                        type="text"
                        id="timings"
                        placeholder="Enter your timings"
                        value={timings}
                        onChange={(e) => setTimings(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.timings && <p className="text-red-500">{errors.timings}</p>}
                </div>

                <div>
                    <input
                        type="number"
                        id="fees"
                        placeholder="Enter your fees (in Rs.)"
                        value={fees === "" ? "": fees} 
                        onChange={(e) => setFees(e.target.value === "" ? "" : parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.fees && <p className="text-red-500">{errors.fees}</p>}
                </div>

                <div className="col-span-2">
                    <label htmlFor="photo" className="block">Upload your photo</label>
                    <input
                        type="file"
                        id="photo"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>


                <div className="col-span-2 flex justify-end">
                    <button
                        type="submit"
                        className="bg-customGreen text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Submit
                    </button>
                </div>
            </form>

            <ToastContainer position="top-center" autoClose={3000}/>
        </div>
    );
}

export default TherapistDetails;
