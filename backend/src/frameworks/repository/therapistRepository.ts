import { databaseSchema } from "../database";
const mongoose = require('mongoose');
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
dotenv.config();

export default {
    createtherapist: async (data: any) => {
        try {
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
            return { status: false, message: "Internal server error" };
        }
    },

    getTherapistByEmail: async (email: string) => {
       
        try {
            const therapist = await databaseSchema.Therapist.findOne({ email });
           
            if(therapist) {
                return {status: true, user:therapist};
            } else {
                return {status: false, message: 'Therapist not found'}
            }

        } catch (error) {
            return {status: false};
        }
    },

    
    saveTherapist: async (therapistData: any) => {
        try {
                const existingTherapist = await databaseSchema.Therapist.findById(therapistData.therapistId);
               
                // If therapist exists, update the therapist
                if (existingTherapist) {
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
                            availableSlots: therapistData.availableSlots,
                        },
                        { new: true, runValidators: true }
                    );
    
                    return { status: true, data: updatedTherapist };
                }
            
            delete therapistData.therapistId; 
    
            const therapist = new databaseSchema.Therapist(therapistData);
            const savedTherapist = await therapist.save();
            
            return { status: true, data: savedTherapist };
    
        } catch (error) {
            return { status: false, message: "Internal Server Error" };
        }
    },

    uploadPhoto: async (therapistId: string, photoUrl: string) => {
        try {
            const existingTherapist = await databaseSchema.Therapist.findById(therapistId);
            
            if (existingTherapist) {
                const updatedTherapist = await databaseSchema.Therapist.findByIdAndUpdate(
                    therapistId,
                    { photo: photoUrl},
                    { new: true }
                );
                return { status: true, data: updatedTherapist}
            }

            return { status: false, message: "Therapist not found"}
        } catch (error) {
            return { status: false, message: "Internal Server Error"}
        }
    },



    getProfile: async(data: any) => {
        try {
            const therapist = await databaseSchema.Therapist.find();
            if(therapist) {
                return { status: true, data:{therapist}}
            } else {
                return { status: false, message: "Therapist profile not found"}
            }
        } catch (error) {
            return { status: false, message: "Error occured during getting therapist profile"}
        }
    },


    getDetails: async(therapistId: string) => {
        try {
            const therapistDetails = await databaseSchema.Therapist.findById(therapistId);
            
            const availableSlots = therapistDetails?.availableSlots
            const booked = therapistDetails?.booked
            const timings = therapistDetails?.timings

            return {
                status: true,
                data :{
                    availableSlots,
                    booked,
                    timings
                }
            }
            
        } catch (error) {
            return {
                status: false,
                message : "Failed to fetch therapist details"
            }
        }
    },

    
    getBookings: async(therapistId: string, page: number, limit: number) => {
       
        try {

            const totalBookingsCount = await databaseSchema.Appointment.countDocuments({therapistId})
            const totalPages = Math.ceil(totalBookingsCount / limit);

            const bookings = await databaseSchema.Appointment.find( {therapistId} ).skip((page-1)*limit).limit(limit);
        
            if(!bookings) {
                return {
                    status: false, message: "Bookings not found"
                }
            }

            // query to get the userdetails 
            const bookingsWithUserDetails = await Promise.all(bookings.map(async (booking) => {
                const user = await databaseSchema.User.findById(booking.userId).select('name email mobile');
            
                return {
                    ...booking.toObject(),
                    user: user ? {name: user.name, email: user.email, mobile: user.mobile} : 'Unknown user'
                }
            }))


            return {
                status: true, message: "Bookings retrieved successfully", data:bookingsWithUserDetails, totalPages
            }
            
        } catch (error) {
            return {
                status: false, message: "Error fetching bookings"
            }
        }
        
    },

    updateTimings: async (email: string, startTime: string, endTime: string, date: string) => {
        try {
            const therapist = await databaseSchema.Therapist.findOne({ email });
          
            if (!therapist) {
                return { status: false, message: "Therapist not found"}
            }
           
         
            const startDateTime = new Date(`${date} ${startTime}`)
            const endDateTime = new Date(`${date} ${endTime}`);

            const currentDateTime = new Date();

            if (startDateTime >= endDateTime) {
                return { status: false, message: "Start time must be before end time"};
            }

            if (startDateTime <= currentDateTime) {
                return { status: false, message: "Start time must be in the future"};
            }

            const newTiming = {
                date: new Date(date),
                startTime: startDateTime,
                endTime: endDateTime
            }

            therapist.updatedTimings.push(newTiming);

            await therapist.save();

            return { status: true, data: therapist}
            
        } catch (error) {
            return { status: false, message:"Error occured during updatiing therapist timings"}
        }
    },

    cancelAppointmentTherapist:  async ({ bookingId} : {bookingId: string}) => {
        try {
            const appointment = await databaseSchema.Appointment.findById(bookingId);

            if (!appointment) {
                return { status: false, message: "Appointment not found or invalid details"}
            }

            appointment.status = "cancelled";
            await appointment.save();

            return { status: true, message: "Appointment cancelled successfuly"}
        } catch (error) {
            return { status: false, message: "Failed to cancel appointment"};
        }
    },

    getCancelSlot: async ({slotId, therapistId} : {slotId: string, therapistId: string}) => {
        try {
            const therapist = await databaseSchema.Therapist.findById(therapistId);

            if (!therapist) {
                return { status: false, message: "Therapist not found"}
            }

            therapist.availableSlots.pull({ _id: slotId });

            await therapist.save();

            return { status: true, message: "Slot removed successfully"}

        } catch (error) {
            return { status: false, message: "Failed to remove slot"}
        }
    }
    
}



