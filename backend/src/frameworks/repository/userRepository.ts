import { databaseSchema } from "../database";

export default {
    createUser: async(data: any) => {
        try {
            console.log(data);

            const {
                name,
                email,
                password,
                mobile,
                role,
            } = data;

            let user;
            if(role === 'user') {
                user = new databaseSchema.User({
                    name,
                    email,
                    password,
                    mobile,
                    role,
                    isVerified:true
                });
            } else {
                user = new databaseSchema.User({
                    name,
                    email,
                    password,
                    mobile,
                    role,
                    isVerified:false
                });
            }
            const response = await user.save();
            if(response) {
                return { status:true, data: response};
            } else {
                return { status: false, message: "User creation failed"}
            }
        } catch(error) {
            console.error("Error in creating user:", error);
            return {status: false, message: "Internal server error"};
        }
    }
}