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
    }
}



