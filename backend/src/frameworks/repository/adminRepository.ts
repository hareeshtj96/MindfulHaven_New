
import { Stats } from "fs";
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
    },

    getAllTherapists: async(data: any)=> {
        try {
            const page = data.page || 1;
            const limit = data.limit || 8;
            const skip = (page - 1)*limit;

            const therapists = await databaseSchema.Therapist.find().skip(skip).limit(limit)
            console.log("get all therapist:", therapists);

            const totalTherapist = await databaseSchema.Therapist.countDocuments();
            console.log("totalTherapists ....", totalTherapist);

            if(therapists && therapists.length > 0) {
                return {
                    status: true,
                    data: {
                        therapists, 
                        total: totalTherapist,
                        currentPage : page,
                        totalPages : Math.ceil(totalTherapist/limit),

                    }
                }
            } else {
                return { status: false, message: "Therapists not found"};
            }
        } catch (error) {
            console.log("Error in adminRepository.getAllTherapists", error);
            return { status: false, message: "Error occured during get Therapists"};
        }
    },

    getAllUsers: async(data: any) => {
        try {
            const page = data.page || 1;
            const limit = data.limit || 8;
            const skip = (page-1)* limit;

            const users = await databaseSchema.User.find().skip(skip).limit(limit)
            console.log("Get all users:", users);

            const totalUsers = await databaseSchema.User.countDocuments();
            console.log("total users:", totalUsers);

            if(users && users.length > 0) {
                return {
                    status: true,
                    data: {
                        users,
                        total: totalUsers,
                        currentPage: page,
                        totalPages: Math.ceil(totalUsers/limit)
                    }
                }
            } else {
                return { status: false, message: "User not found"};
            }
        } catch (error) {
            console.log("Error in adminRepository.getAllUsers", error);
            return { status: false, message: "Error occured during get Therapists"};
        }
    },


    getVerified: async (therapistId: string) => {
        try {
            const therapist = await databaseSchema.Therapist.findById(therapistId);

            if(!therapist) {
                return { status: false, message: "Therapist not found"};
            }

            const newVerifiefStatus = !therapist.isVerified;

            const updatedTherapist = await databaseSchema.Therapist.findByIdAndUpdate(
                therapistId,
                { isVerified: newVerifiefStatus },
                { new: true }
            );

            console.log("updated therapist verification:", updatedTherapist);

            if(updatedTherapist) {
                return { status: true, data: { therapist: updatedTherapist }};
            } else {
                return { status: false, message: "Therapist not found or verification failed"}
            }
        } catch (error) {
            console.log("Error in get Verified repository:", error);
            return { status: false, message: "Error occured during therapist verification"};
        }
    }
}