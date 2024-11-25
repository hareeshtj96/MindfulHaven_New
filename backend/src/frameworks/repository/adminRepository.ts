
import { databaseSchema } from "../database";
import { sendIssueNotificationEmail } from "../../utils/nodemailer";
import dotenv from 'dotenv';
dotenv.config();


export default {
    getAdminByEmail: async (email: string, password: string) => {
        try {
            const admin = await databaseSchema.Admin.findOne({ email });
            
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
            return {status: false};
        }
    },

    getAllTherapists: async(data: any)=> {
        try {
            const page = data.page || 1;
            const limit = data.limit || 2;
            
            const skip = (page - 1)*limit;

            const therapists = await databaseSchema.Therapist.find().skip(skip).limit(limit)
           
            const totalTherapist = await databaseSchema.Therapist.countDocuments();
            
           
            const totalPages = Math.ceil(totalTherapist/ limit)
           
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
            return { status: false, message: "Error occured during get Therapists"};
        }
    },

    getAllUsers: async(data: any) => {
        try {
            const page = data.page || 1;
            const limit = data.limit || 8;
            const skip = (page-1)* limit;

            const users = await databaseSchema.User.find().skip(skip).limit(limit)
            
            const totalUsers = await databaseSchema.User.countDocuments();
           
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

            if(updatedTherapist) {
                return { status: true, data: { therapist: updatedTherapist }};
            } else {
                return { status: false, message: "Therapist not found or verification failed"}
            }
        } catch (error) {
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
            
            if(updatedUser) {
                return { status: true, data: { user: updatedUser}}
            } else {
                return { status: false, message: "user not found"}
            }
        } catch (error) {
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
            return { status: false, message: "An error occurred while fetching the therapist details", error: error.message };
        }
    },

    getAllIssues: async () => {
        console.log("get all issues repository...");
        try {
            const issues = await databaseSchema.Issue.find();
          
            const enrichedIssues = [];

            for (const issue of issues) {
                const issueObject = issue.toObject();


                const user = await databaseSchema.User.findById(issue.userId).select('name');
                const therapist = await databaseSchema.Therapist.findById(issue.therapistId).select('name');


                const enrichedIssue = {
                    ...issueObject,
                    userName: user ? user.name : "unknown user",
                    therapistName: therapist ? therapist.name : "unknown Therapist"
                };

                enrichedIssues.push(enrichedIssue);
            }

            return { status: true, data: enrichedIssues };
        } catch (error: any) {
            return { status: false, message: "Error occured while fetching issues"}
        }
    },

    dashboardDetails: async () => {
        try {
            const totalUsers = await databaseSchema.User.countDocuments()

            const totalTherapists = await databaseSchema.Therapist.countDocuments()

            const totalAppointments = await databaseSchema.Appointment.countDocuments()

            const totalRevenueData = await databaseSchema.Payment.aggregate([
                {
                    $match: {
                        paymentStatus: "success",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$convenienceFee"
                        }
                    }
                }
            ]);

            const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].totalRevenue : 0

            return {
                status: true,
                data: {
                    totalUsers,
                    totalTherapists,
                    totalAppointments,
                    totalRevenue
                }
                
            }
        } catch (error) {
            return { status: false, message: "Error fetching dashboard details"}
        }
    },

    

    getIssueResolved: async (issueId: string) => {
        try {
            const issue = await databaseSchema.Issue.findById(issueId);
            
            if(!issue) {
                return { status: false, message: "Issue not found"}
            }

            const therapistId = issue.therapistId;
          
            const userId = issue.userId;

            if (issue.category === "therapist") {
            
                const therapist = await databaseSchema.Therapist.findById(therapistId).select('email name')
                const user = await databaseSchema.User.findById(userId).select('name')
               
                
                if(therapist && therapist.email && user) {
                    const therapistEmail = therapist.email;
                    const therapistName = therapist.name;
                    const userName = user.name

                    const emailResponse = await sendIssueNotificationEmail(therapistEmail, therapistName, issue.description, userName ?? 'user');

                    if(emailResponse.status) {
                        
                        issue.status = "resolved";
                        await issue.save();
                    } else {
                        return { status: false, message: emailResponse.message}
                    }
                } else {
                    return { status: false, message: "Therapist email not found"};
                }
               
            } else {
                issue.status = "resolved";
                await issue.save();
            }

            return { status: true, message: "Issue resolved successfully"}
        } catch (error) {
            return { status: false, message: "Failed to resolve the issue"}
        }
    },




    adminNotifications: async () => {
        try {
            const therapists = await databaseSchema.Therapist.find({
                isVerified: false
            });

            const issues = await databaseSchema.Issue.find({
                status: 'pending',
                rating : { $exists: false }
            });

            return {
                status: true, 
                data: {
                    pendingTherapistVerification: therapists.map((therapist) => ({
                        id: therapist._id,
                        name: therapist.name,
                        email: therapist.email,
                    })),
                    pendingIssuesCount: issues.length,
                },
            };

        } catch (error) {
            console.error("Error fetching admin notifications:", error);
            return { status: false, message: "Error fetching admin notifications"}
        }
    }

   
    
}