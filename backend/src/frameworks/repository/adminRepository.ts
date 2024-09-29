
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
            const limit = data.limit || 2;
            console.log("limit:",limit);
            
            const skip = (page - 1)*limit;

            const therapists = await databaseSchema.Therapist.find().skip(skip).limit(limit)
            // console.log("get all therapist:", therapists);

            const totalTherapist = await databaseSchema.Therapist.countDocuments();
            // console.log("totalTherapists ....", totalTherapist);

            console.log("total number of therapisst:", totalTherapist);
            console.log("limit per page:", limit);
            const totalPages = Math.ceil(totalTherapist/ limit)
            console.log("Total pages:", totalPages);
            

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
    },

    getBlock: async ( userId: string) => {
        try {
            const user = await databaseSchema.User.findById(userId);

            if(!user) {
                return { status: false, message: "User not found"}
            }

            const newStatus = !user.isBlocked;

            const updatedUser = await databaseSchema.User.findByIdAndUpdate(
                userId,
                { isBlocked: newStatus},
                { new: true}
            )
            console.log("updated user :", updatedUser);

            if(updatedUser) {
                return { status: true, data: { user: updatedUser}}
            } else {
                return { status: false, message: "user not found"}
            }
        } catch (error) {
            console.log("Error in get blocked repository:", error);
            return { status: false, message: "Error occured during user block unblock"};
        }
    },

    therapistDetails: async (therapistId: string) => {
        console.log("therapist id in admin repostioy:", therapistId);
        try {
            const therapist = await databaseSchema.Therapist.findById(therapistId);
        
            if(!therapist) {
                return { status: false, message: "Therapist not found"}
            }
            
            return { status: true, message: "Therapist fetched successfully", therapist}
        } catch (error: any) {
            console.log("Error in therapist details:", error);
            return { status: false, message: "An error occurred while fetching the therapist details", error: error.message };
        }
    }
}