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
            } else {
                console.error("Password is missing or invalid");
                return { status: false, message: "Password is required"}
            }

            const user = new databaseSchema.User({
                name,
                email,
                password: hashedPassword,
                mobile,
                role,
                isVerified: true,
            });

            const savedUser = await user.save()
            console.log("New user created:", savedUser);

            //creating wallet for user
            const newWallet = new databaseSchema.Wallet({
                userId: savedUser._id,
                balance: 0,
                transactionHistory:[],
                currency: 'INR'
            });

            

            // saving wallet
            const savedWallet = await newWallet.save();
            console.log("new wallet created:", savedWallet);

            // update user with the wallet reference
            savedUser.wallet = savedWallet._id;
            await savedUser.save();

            const userWithWallet = await databaseSchema.User.findById(savedUser._id).populate('wallet')

           return { status: true, data: { user: userWithWallet, wallet: savedWallet}}
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

    changePassword: async ({email, currentPassword, newPassword, confirmPassword}: { email: string; currentPassword: string; newPassword: string; confirmPassword: string}) => {
        try {
            const user = await databaseSchema.User.findOne({email});
          
            if (!user) {
                return { status: false, message: "User not found"}
            }

            if (user && user.password) {
                // comparing current password with hashed password in the database
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
           
                if (!isPasswordValid) {
                    return { status: false, message: "Current password is incorrect"};
                }
            }

            if (newPassword !== confirmPassword) {
                console.log(" passwords do not match");
                
                return { status: false, message: "New password and confim password do not match"}
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            
            const updatedUser = await databaseSchema.User.findOneAndUpdate(
                {email},
                { password: hashedNewPassword },
                {new: true}
            );

            if (updatedUser) {
                return { status: true, message: "Password updated successfully"};
            } else {
                return { status: false, message: "Failed to update password"}
            }

        } catch (error) {
            console.error("Error in change password:", error);
            return { status: false, message: "Error occured while changing password"}
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

    getChildTherapist: async( page: number, limit: number) => {
        try {
            const skip = (page - 1) * limit;

            const therapists = await databaseSchema.Therapist.find({ 
                specialization: 'Child Therapy',
                isVerified: true
            }).skip(skip).limit(limit);

            const totalTherapists = await databaseSchema.Therapist.countDocuments({ specialization: 'Child Therapy', isVerified: true});
            
            return {
                status: true,
                data: {
                    therapists,
                    total: totalTherapists,
                    currentPage: page, 
                    totalPages: Math.ceil(totalTherapists / limit)
                }
            };
        } catch (error) {
            console.error("Error fetching child therapists:", error);
            return {
                status: false, message: "Error fetching child therapists"
            }
        }
    },

    getTherapistDetails: async(therapistId: string) => {
        console.log("therapist id:", therapistId);
        try {
            const therapists = await databaseSchema.Therapist.findOne({
                _id: therapistId, 
                isVerified: true
            });

            return {
                status: true,
                data: therapists
            };
        } catch (error) {
            console.error("Error fetching therapists details:", error);
            return {
                status: false, message: "Error fetching therapists"
            }
        }
    },

    getSlot: async(therapistId: string) => {
        try {
            const therapist = await databaseSchema.Therapist.findOne({ _id: therapistId, isVerified: true});

            if(!therapist) {
                return {
                    status: false,
                    mesage: "Therapist not found or not verified"
                }
            }
            const { timings, availableSlots } = therapist;

            return {
                status: true,
                data: {
                    timings, 
                    availableSlots
                }
            }
        } catch (error) {
            console.error("Error fetching therapist slots:", error);
            return {
                status: false,
                message: "Error fetching therapist slots"
            }
        }
    },


    getBookedSlot: async(therapistId: string) => {
        console.log("therapist id from user repository:", therapistId);
        try {
            const bookedSlots = await databaseSchema.Appointment.find({ therapistId });
            console.log("booked slots:", bookedSlots);
            
            if(!bookedSlots ) {
                return {
                    status: false,
                    message: "booked slot not found"
                }
            }
            const slots = bookedSlots.map((appointment) => {
                return appointment.slot
            })
            console.log("slots.....", slots);
            
            return {
                status: true,
                message: "Booked slots retrieved successfully",
                data: slots
            }
        } catch (error) {
            console.error("Error fetching booked slots:", error);
            return {
                status: false,
                message: "Error fetching booked slots"
            }
        }
    },



    saveAppointment: async({ therapistId, userId, slot, notes, paymentId}: {therapistId: string, userId: string, slot: Date, notes?: string, paymentId:string}) => {
        try {
            const existingAppointment = await databaseSchema.Appointment.findOne({
                therapistId, slot
            });

            if(existingAppointment) {
                return {
                    status: false,
                    message: "The slot is already booked. Please choose a different slot"
                }
            }

            const paymentDetails = await databaseSchema.Payment.findById(paymentId)

            if (!paymentDetails) {
                return {
                    status: false,
                    message: "Payment details not found."
                };
            }

            const newAppointment = new databaseSchema.Appointment({
                therapistId,
                userId,
                slot,
                notes,
                payment: {
                    userId: paymentDetails.userId,
                    therapistId: paymentDetails.therapistId,
                    amount: paymentDetails.amount,
                    convenienceFee: paymentDetails.convenienceFee,
                    totalAmount: paymentDetails.totalAmount,
                    paymentMethod: paymentDetails.paymentMethod,
                    paymentStatus: paymentDetails.paymentStatus,
                    paymentDate: paymentDetails.paymentDate,
                    refundRequest: paymentDetails.refundRequest,
                    refundReason: paymentDetails.refundReason,
                    refundProcessedAt: paymentDetails.refundProcessedAt,
                }
            });

            const savedAppointment = await newAppointment.save();
            console.log("asved appoint....",savedAppointment);
            

            return {
                status: true, data: savedAppointment
            }
        } catch (error: any) {
            console.error("Error saving appointment:", error);
            return {
                status: false,
                message: "Failed to save the appointment"
            }
            
        }
    },

    bookingDetails : async({ bookingId} : {bookingId: string}) => {
        try {
            const response = await databaseSchema.Appointment.findById(bookingId)
            console.log("response from bookign details:", response);

            return response;
        } catch (error: any) {
            console.error("Error fetching booking details:", error);
            return {status: false, message:"Failed to find booking details"}
        }
    },

    

    cancelAppointment: async ({ bookingId, userId} : {bookingId: string, userId: string}) => {
        try {
            const appointment = await databaseSchema.Appointment.findById(bookingId);

            if (!appointment) {
                return { status: false, message: "Appointment not found or invalid details"}
            }

            if (appointment.status === "cancelled") {
                return { status: false, message: "Appointment already cancelled"}
            }

            appointment.status = "cancelled";
            await appointment.save();

            const userWallet = await databaseSchema.Wallet.findOne({ userId });

            if (!userWallet) {
                return { status: false, message :"user wallet not found"}
            }

            const refundAmount = appointment.payment?.amount;

            if (!refundAmount) {
                return { status: false, message : "Refund amount not found"}
            }

            userWallet.balance += refundAmount;

            userWallet.transactionHistory.push({
                type: "refund",
                amount: refundAmount,
                date: new Date()
            });

            await userWallet.save();

            return { status: true, message: "Appointment cancelled successfuly and amount refunded successfully"}
        } catch (error) {
            console.error("Error while cancelling appointment:", error);
            return { status: false, message: "Failed to cancel appointment and refund amount"};
        }
    },


    getAllBooking : async(userId:string, page: number, limit:number) => {
        try {
            const skip = (page - 1) * limit;

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const bookings = await databaseSchema.Appointment.find({ userId : userId , status: "scheduled", slot: {$gte : currentDate} }).skip(skip).limit(limit);
           

            // Fetch therapist details for each booking
            const bookingWithTherapists = await Promise.all(bookings.map(async (booking: any) => {
                const therapistDetails = await databaseSchema.Therapist.findById(booking.therapistId);
                return {
                    ...booking._doc,
                    therapist: therapistDetails
                }
            }))
           

            const totalBookings = await databaseSchema.Appointment.countDocuments({ userId : userId, status: "scheduled", slot: { $gte: currentDate} })

            return {
                status: true,
                data:{
                    bookings: bookingWithTherapists,
                    total: totalBookings,
                    currentPage: page,
                    totalPages: Math.ceil(totalBookings/limit)
                }
            }
        } catch (error: any) {
            console.error("Error fetching all booking details:", error);
            return { status: false, message: "Failed to find all booking details"}
        }
    },

    getCompletedBooking : async(userId:string, page: number, limit:number) => {
        try {
            const skip = (page - 1) * limit;
            const bookings = await databaseSchema.Appointment.find({ userId : userId, status: "completed" }).skip(skip).limit(limit);
         
            // Fetch therapist details for each booking
            const bookingWithTherapists = await Promise.all(bookings.map(async (booking: any) => {
                const therapistDetails = await databaseSchema.Therapist.findById(booking.therapistId);
                return {
                    ...booking._doc,
                    therapist: therapistDetails
                }
            }))

            const totalBookings = await databaseSchema.Appointment.countDocuments({ userId : userId, status: "completed" })

            return {
                status: true,
                data:{
                    bookings: bookingWithTherapists,
                    total: totalBookings,
                    currentPage: page,
                    totalPages: Math.ceil(totalBookings/limit)
                }
            }
        } catch (error: any) {
            console.error("Error fetching all booking details:", error);
            return { status: false, message: "Failed to find all booking details"}
        }
    },


    getCancelledBooking: async(userId: string, page: number, limit: number) => {
        try {
            const skip = (page - 1) * limit;
            const bookings = await databaseSchema.Appointment.find({ userId : userId, status: "cancelled"}).skip(skip).limit(limit);
     
            // Fetch therapist details for each booking
            const bookingWithTherapists = await Promise.all(bookings.map(async (booking: any) => {
                const therapistDetails = await databaseSchema.Therapist.findById(booking.therapistId);
                return {
                    ...booking._doc,
                    therapist: therapistDetails
                }
            }))

            const totalBookings = await databaseSchema.Appointment.countDocuments({ userId : userId, status: "cancelled" })

            return {
                status: true,
                data: {
                    bookings: bookingWithTherapists,
                    total: totalBookings,
                    currentPage: page,
                    totalPages: Math.ceil(totalBookings/limit)
                }
            }
            
        } catch (error: any) {
            console.error("Error fetching all booking details:", error);
            return { status: false, message: "Failed to find all booking details"}
        }
    },


    getSearchResult: async (searchTerm: string) => {
        const filter = {
            $or:[
                {name: {$regex: searchTerm, $options:'i'}},
                { specialization: { $regex: searchTerm, $options: 'i'}}
            ],
        }

        try {
            const therapists = await databaseSchema.Therapist.find(filter);
            console.log("result from repository....", therapists);

            return therapists
            
        } catch (error) {
            console.error("Error fetching search result:", error);
            return { status: false, message: "Failed to fetch search results"}
            
        }
    },

    getChildTherapistSearchResult: async (searchTerm: string) => {
        const filter = {
            $or:[
                {name: {$regex: searchTerm, $options:'i'}},
                { specialization: { $regex: searchTerm, $options: 'i'}}
            ],
        };

        try {
            const therapists = await databaseSchema.Therapist.find(filter)
            return therapists;
            
        } catch (error) {
            console.error("Error fetching child therapists:", error);
            return { status: false, message: "Failed to fetch search child therapists"}
        }
    },


    getSortedTherapists: async ( sortCriteria: any) => {
        try {
            const sortedTherapists = await databaseSchema.Therapist.find({ 
                specialization: 'Child Therapy',
                isVerified: true
            }).sort(sortCriteria);
           

            return sortedTherapists
            
        } catch (error) {
            console.error("Error fetching sorted therapists:", error);
            return { status: false, message: "Error fetching sorted therapists"}
        }
    },


    savePayment: async (paymentData: any) => {
        try {
            const result = await databaseSchema.Payment.create(paymentData);
            console.log("result from repository:", result);

            return { status: true, data: result, paymentId: result._id}
            
        } catch (error) {
            console.error("Error saving payment:", error);
            return { status: false, message: 'Failed to save payment'}
            
        }
    },

    walletDetails: async ({userId} : {userId: string}) => {
        try {
            const result = await databaseSchema.Wallet.findOne({userId})
            
            if (!result) {
                console.log("No wallet found for this user");
                return { status: false, message: "Wallet not found"};
                
            }
            console.log("result from wallet repository:", result);
            return { status: true, data: result }
            
        } catch (error) {
            console.error("Error retrieving wallet details:", error);
            return { status: false, message : "Failed to retrieve wallet details"}
        }

    },


}
