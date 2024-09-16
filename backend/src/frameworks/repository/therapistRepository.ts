import { databaseSchema } from "../database";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
dotenv.config();

export default {
    createtherapist: async (data: any) => {
        try {

            console.log("create therapist data:", data);
            const { name, email, password, role } = data;
            
            let hashedPassword = null;
            if (password) {
                 hashedPassword = await bcrypt.hash(password, 10);
            }

            const therapist = new databaseSchema.Therapist({
                name,
                email,
                password: hashedPassword,
                role,
                isVerified: false
            });

            const response = await therapist.save();
            if (response) {
                return { status: true, data: response };
            } else {
                return { status: false, message: "therapist creation failed" };
            }
        } catch (error) {
            console.error("Error in creating therapist:", error);
            return { status: false, message: "Internal server error" };
        }
    },

    getTherapistByEmail: async (email: string) => {
        console.log("entered getTherapistByEmail");
        console.log("type of email:", typeof email);
        
        try {
            const therapist = await databaseSchema.Therapist.findOne({ email });
            console.log("therapist from gettherapist:", therapist);

            if(therapist) {
                return {status: true, user:therapist};
            } else {
                return {status: false, message: 'Therapist not found'}
            }

            
            
        } catch (error) {
            console.error("Error in getTherapistByEmail:", error);
            return {status: false};
        }
    },

    saveTherapist: async (therapistData: any) => {
        try {

            console.log("therapist data:", therapistData);
            const existingTherapist = await databaseSchema.Therapist.findById(therapistData.therapistId);
            console.log("existing therapist:", existingTherapist);

            if(existingTherapist) {
                const updatedTherapist = await databaseSchema.Therapist.findByIdAndUpdate(
                    therapistData.therapistId,
                    {
                        name: therapistData.name,
                        phone: therapistData.phone,
                        specialization: therapistData.specialization,
                        gender: therapistData.gender,
                        educationalQualifications: therapistData.educationalQualifications,
                        identityProof: therapistData.identityProof,
                        counsellingQualification: therapistData.counsellingQualification,
                        professionalExperience: therapistData.professionalExperience,
                        establishment: therapistData.establishment,
                        location: therapistData.location,
                        timings: therapistData.timings,
                        fees: therapistData.fees,
                        photo: therapistData.photo,
                    },
                    { new: true, runValidators: true}
                );

                return { status: true, data: updatedTherapist };
            } else {
                const therapist = new databaseSchema.Therapist(therapistData);
                const savedTherapist = await therapist.save();
                return { status: true, data: savedTherapist};
            }
        } catch (error) {
            console.error("Error in saving Therapist:", error);
            return { status: false, message: "Internal Server Error"}
        }
    },



    getProfile: async(data: any) => {
        try {
            const therapist = await databaseSchema.Therapist.find();
            console.log("therapist profile:", therapist);

            if(therapist) {
                return { status: true, data:{therapist}}
            } else {
                return { status: false, message: "Therapist profile not found"}
            }
        } catch (error) {
            console.log("Error in therapist reposotry:", error);
            return { status: false, message: "Error occured during getting therapist profile"}
        }
    },

    
}



