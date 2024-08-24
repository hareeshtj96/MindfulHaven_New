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

    updateUserPassword: async ({ email, hashedPassword }: {email:string, hashedPassword: string }) => {
        try {

            console.log("email:", email);
            const user = await databaseSchema.User.findOneAndUpdate(
                {email:email},
                {password: hashedPassword },
            );

            console.log('user:', user);

            if(user) {
                return { status: true, data: "password updated successfully"};
            } else {
                return { status: false, message: "User not found or update failed"}
            }
        } catch (error) {
            console.error("Error in updating user password:", error);
            throw new Error("Internal Server Error");
        }
    }

}
