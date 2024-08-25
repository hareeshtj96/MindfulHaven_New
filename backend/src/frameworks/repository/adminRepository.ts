
import { databaseSchema } from "../database";
import dotenv from 'dotenv';
dotenv.config();



export default {
    getAdminByEmail: async (email: string, password: string) => {
        console.log("entered getAdminByEmail");
        
        try {
            const admin = await databaseSchema.Admin.findOne({ email });
            console.log("Admin from getAdmin:", admin);

            if(admin) {
                if(admin.password === password) {
                    return {status: true, user:admin};
                } else {
                    return { status: false, message: 'Incorrect password'}
                } 
            } else {
                return { status: false, message: 'Admin not found'};
            }
            
        } catch (error) {
            console.error("Error in getAdminByEmail:", error);
            return {status: false};
        }
    }
}