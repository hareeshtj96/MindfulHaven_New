import dependencies from "../config/dependencies";
import { databaseSchema } from "../database";
import bcrypt from "bcryptjs";

export default {
    createUser: async (data: any) => {
        try {

            console.log("create user data:", data);
            const { name, email, password, mobile, role } = data;
            
            let hashedPassword = null;
            if (password) {
                 hashedPassword = await bcrypt.hash(password, 10);
            }

            const user = new databaseSchema.User({
                name,
                email,
                password: hashedPassword,
                mobile,
                role,
                isVerified: true
            });

            const response = await user.save();
            if (response) {
                return { status: true, data: response };
            } else {
                return { status: false, message: "User creation failed" };
            }
        } catch (error) {
            console.error("Error in creating user:", error);
            return { status: false, message: "Internal server error" };
        }
    },

    getUserByEmail: async (data: any) => {
        try {
            const {email} = data;
            const user = await databaseSchema.User.findOne({email});
    
            if(user) {
                return {status: true, data: user};
            } else {
                return {status: false, message: "User not found"};
            }
        } catch(error) {
            console.error("Error in getting user by email:", error);
            throw new Error("Internal Server Error");
        }
    },

    updateUserPassword: async ({ email, hashedPassword }: { email: string; hashedPassword: string }) => {
        try {
    
            const updatedUser = await databaseSchema.User.findOneAndUpdate(
                {email},
                {password: hashedPassword },
            );

            console.log('updateduser:', updatedUser);

            if(updatedUser) {
                return { status: true, data: "password updated successfully"};
            } else {
                return { status: false, message: "User not found or update failed"}
            }
        } catch (error) {
            console.error("Error in updating user password:", error);
            throw new Error("Internal Server Error");
        }
    },   

    getUserProfile: async(email: string) => {
        try {
            const user = await databaseSchema.User.findOne({email});
            console.log("foind user profile:", user);
            console.log("user profile:", user);

            if(user) {
                return { status: true, data: {user}}
            } else {
                return { status: false, message: "User profile not found"}
            }
        } catch (error) {
            console.log("Error in user repository:", error);
            return { status: false, message: "Error occured during getting user profile"}
        }
    },

    getChildTherapist: async() => {
        try {
            const therapists = await databaseSchema.Therapist.find({ 
                specialization: 'Child Therapy',
                isVerified: true
            });
            console.log("child therapist found:", therapists);
            return {
                status: true,
                data: therapists
            };
        } catch (error) {
            console.error("Error fetching child therapists:", error);
            return {
                status: false, message: "Error fetching child therapists"
            }
        }
    }

}
