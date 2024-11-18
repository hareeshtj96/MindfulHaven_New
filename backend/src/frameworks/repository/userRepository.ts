import { StringExpressionOperatorReturningString } from "mongoose";
import { databaseSchema } from "../database";
import bcrypt from "bcryptjs";

export default {
    createUser: async (data: any) => {
        try {
            const { name, email, password, mobile, role } = data;

            let hashedPassword = null;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            } else {
                return { status: false, message: "Password is required" };
            }

            const user = new databaseSchema.User({
                name,
                email,
                password: hashedPassword,
                mobile,
                role,
                isVerified: true,
            });

            const savedUser = await user.save();

            //creating wallet for user
            const newWallet = new databaseSchema.Wallet({
                userId: savedUser._id,
                balance: 0,
                transactionHistory: [],
                currency: "INR",
            });

            // saving wallet
            const savedWallet = await newWallet.save();

            // update user with the wallet reference
            savedUser.wallet = savedWallet._id;
            await savedUser.save();

            const userWithWallet = await databaseSchema.User.findById(
                savedUser._id
            ).populate("wallet");

            return {
                status: true,
                data: { user: userWithWallet, wallet: savedWallet },
            };
        } catch (error) {
            return { status: false, message: "Internal server error" };
        }
    },

    getUserByEmail: async (data: any) => {
        try {
            const { email } = data;
            const user = await databaseSchema.User.findOne({ email });

            if (user) {
                return { status: true, data: user };
            } else {
                return { status: false, message: "User not found" };
            }
        } catch (error) {
            throw new Error("Internal Server Error");
        }
    },

    updateUserPassword: async ({
        email,
        hashedPassword,
    }: {
        email: string;
        hashedPassword: string;
    }) => {
        try {
            const updatedUser = await databaseSchema.User.findOneAndUpdate(
                { email },
                { password: hashedPassword }
            );

            if (updatedUser) {
                return { status: true, data: "password updated successfully" };
            } else {
                return { status: false, message: "User not found or update failed" };
            }
        } catch (error) {
            throw new Error("Internal Server Error");
        }
    },

    changePassword: async ({
        email,
        currentPassword,
        newPassword,
        confirmPassword,
    }: {
        email: string;
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        try {
            const user = await databaseSchema.User.findOne({ email });

            if (!user) {
                return { status: false, message: "User not found" };
            }

            if (user && user.password) {
                // comparing current password with hashed password in the database
                const isPasswordValid = await bcrypt.compare(
                    currentPassword,
                    user.password
                );

                if (!isPasswordValid) {
                    return { status: false, message: "Current password is incorrect" };
                }
            }

            if (newPassword !== confirmPassword) {
                return {
                    status: false,
                    message: "New password and confim password do not match",
                };
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            const updatedUser = await databaseSchema.User.findOneAndUpdate(
                { email },
                { password: hashedNewPassword },
                { new: true }
            );

            if (updatedUser) {
                return { status: true, message: "Password updated successfully" };
            } else {
                return { status: false, message: "Failed to update password" };
            }
        } catch (error) {
            return {
                status: false,
                message: "Error occured while changing password",
            };
        }
    },

    getUserProfile: async (email: string) => {
        try {
            const user = await databaseSchema.User.findOne({ email });

            if (user) {
                return { status: true, data: { user } };
            } else {
                return { status: false, message: "User profile not found" };
            }
        } catch (error) {
            return {
                status: false,
                message: "Error occured during getting user profile",
            };
        }
    },

    getChildTherapist: async (page: number, limit: number) => {
        try {
            const skip = (page - 1) * limit;

            const therapists = await databaseSchema.Therapist.find({
                specialization: "Child Therapy",
                isVerified: true,
            })
                .skip(skip)
                .limit(limit);

            const totalTherapists = await databaseSchema.Therapist.countDocuments({
                specialization: "Child Therapy",
                isVerified: true,
            });

            return {
                status: true,
                data: {
                    therapists,
                    total: totalTherapists,
                    currentPage: page,
                    totalPages: Math.ceil(totalTherapists / limit),
                },
            };
        } catch (error) {
            return {
                status: false,
                message: "Error fetching child therapists",
            };
        }
    },

    getFamilyTherapist: async (page: number, limit: number) => {
        try {
            const skip = (page - 1) * limit;

            const familyTherapist = await databaseSchema.Therapist.find({
                specialization: "Family Therapy",
                isVerified: true,
            })
                .skip(skip)
                .limit(limit);

            const totalTherapists = await databaseSchema.Therapist.countDocuments({
                specialization: "Family Therapy",
                isVerified: true,
            });

            return {
                status: true,
                data: {
                    familyTherapist,
                    total: totalTherapists,
                    currentPagesFamily: page,
                    totalPagesFamily: Math.ceil(totalTherapists / limit),
                },
            };
        } catch (error) {
            return {
                status: false,
                message: "Error fetching Family therapists",
            };
        }
    },

    getIndividualTherapist: async (page: number, limit: number) => {
        try {
            const skip = (page - 1) * limit;

            const individualTherapists = await databaseSchema.Therapist.find({
                specialization: "Individual Therapy",
                isVerified: true,
            })
                .skip(skip)
                .limit(limit);

            const totalTherapists = await databaseSchema.Therapist.countDocuments({
                specialization: "Individual Therapy",
                isVerified: true,
            });

            return {
                status: true,
                data: {
                    individualTherapists,
                    total: totalTherapists,
                    currentPagesIndividual: page,
                    totalPagesIndividual: Math.ceil(totalTherapists / limit),
                },
            };
        } catch (error) {
            return {
                status: false,
                message: "Error fetching Individual therapists",
            };
        }
    },

    getCoupleTherapist: async (page: number, limit: number) => {
        try {
            const skip = (page - 1) * limit;

            const coupleTherapists = await databaseSchema.Therapist.find({
                specialization: "Couple Therapy",
                isVerified: true,
            })
                .skip(skip)
                .limit(limit);

            const totalTherapists = await databaseSchema.Therapist.countDocuments({
                specialization: "Couple Therapy",
                isVerified: true,
            });

            return {
                status: true,
                data: {
                    coupleTherapists,
                    total: totalTherapists,
                    currentPagesCouple: page,
                    totalPagesCouple: Math.ceil(totalTherapists / limit),
                },
            };
        } catch (error) {
            return { status: false, message: "Error fetching Couple therapists" };
        }
    },

    getTherapistDetails: async (therapistId: string) => {
        try {
            const therapists = await databaseSchema.Therapist.findOne({
                _id: therapistId,
                isVerified: true,
            });

            return {
                status: true,
                data: therapists,
            };
        } catch (error) {
            return {
                status: false,
                message: "Error fetching therapists",
            };
        }
    },

    getSlot: async (therapistId: string) => {
        try {
            const therapist = await databaseSchema.Therapist.findOne({
                _id: therapistId,
                isVerified: true,
            });

            if (!therapist) {
                return {
                    status: false,
                    mesage: "Therapist not found or not verified",
                };
            }

            // Destructure the required properties
            const { timings, availableSlots, booked } = therapist;

            // Fetch issues related to this therapist, where the rating exists
            const issues = await databaseSchema.Issue.find({
                therapistId: therapistId,
                rating: { $exists: true, $ne: null },
            });

            // Fetch user details for each issue (User collection)
            const issuesWithUserDetails = await Promise.all(issues.map(async (issue) => {
                const issueObj = issue.toObject();
                const user = await databaseSchema.User.findById(issueObj.userId);

                if (user) {
                    // Add user details to the issue object
                    (issueObj as any).userName = user.name;
                    (issueObj as any).userEmail = user.email;
                }
                return issueObj;
            }));


            return {
                status: true,
                data: {
                    timings,
                    availableSlots,
                    booked,
                    issues: issuesWithUserDetails
                },
            };
        } catch (error) {
            return {
                status: false,
                message: "Error fetching therapist slots",
            };
        }
    },

    getBookedSlot: async (therapistId: string) => {
        try {
            const bookedSlots = await databaseSchema.Appointment.find({
                therapistId,
            });

            if (!bookedSlots) {
                return {
                    status: false,
                    message: "booked slot not found",
                };
            }
            const slots = bookedSlots.map((appointment) => {
                return appointment.slot;
            });

            return {
                status: true,
                message: "Booked slots retrieved successfully",
                data: slots,
            };
        } catch (error) {
            return {
                status: false,
                message: "Error fetching booked slots",
            };
        }
    },

    checkSlotBeforePayment: async (
        therapistId: string,
        slotDate: string,
        slotTime: string
    ) => {
        try {
            const bookedSlots = await databaseSchema.Appointment.find({
                therapistId,
                status: "scheduled",
            });

            const validAppointments = bookedSlots.filter((appointment) => {
                if (appointment.payment?.paymentStatus === "success") {
                    return true;
                } else {
                    appointment.status = "cancelled";
                    appointment.save();
                    return false;
                }
            });

            const isSlotBooked = validAppointments.some((appointment) => {
                const appointmentDate = appointment.slot.toISOString().split("T")[0];
                const appointmentTime = new Date(appointment.slot)
                    .toISOString()
                    .split("T")[1]
                    .slice(0, 5);

                return appointmentDate === slotDate && appointmentTime === slotTime;
                ``;
            });

            if (isSlotBooked) {
                return { status: false, message: "Slot is already booked" };
            } else {
                return { status: true, message: "Slot is available" };
            }
        } catch (error) {
            console.error("Error checking slot availability:", error);
            return { status: false, message: "Error fetching appointments" };
        }
    },


    saveAppointment: async ({
        therapistId,
        userId,
        slot,
        notes,
        paymentId,
    }: {
        therapistId: string;
        userId: string;
        slot: Date | string;
        notes?: string;
        paymentId?: string;
    }) => {
        try {
            const slotDate =
                typeof slot === "string" ? new Date(slot) : (slot as Date);

            // Check if the slot is already booked
            const existingAppointment = await databaseSchema.Appointment.findOne({
                therapistId,
                slot: slotDate,
                status: { $ne: "cancelled" },
            });


            if (existingAppointment && typeof paymentId === "undefined") {
                return {
                    status: false,
                    message: "The slot is already booked. Please choose a different slot",
                };
            }

            let paymentDetails;
            if (paymentId) {
                // Fetch payment details if paymentId is provided
                paymentDetails = await databaseSchema.Payment.findById(paymentId);

                if (!paymentDetails) {
                    return {
                        status: false,
                        message: "Payment details not found.",
                    };
                }
            }

            // Create the appointment object
            const appointmentData: any = {
                therapistId,
                userId,
                slot: slotDate,
                notes,
            };

            // Add payment details only if available
            if (paymentDetails) {
                appointmentData.payment = {
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
                };
            }

            // Save the appointment
            const newAppointment = new databaseSchema.Appointment(appointmentData);

            const savedAppointment = await newAppointment.save();

            // Update the therapist's booked slots
            const therapist = await databaseSchema.Therapist.findById(therapistId);
            if (therapist) {
                const bookedSlot = {
                    date: slotDate.toISOString().split("T")[0],
                    time: `${slotDate.getUTCHours() % 12 || 12}:00 ${slotDate.getUTCHours() >= 12 ? "PM" : "AM"
                        }`,
                    status: true,
                };
                therapist.booked.push(bookedSlot);
                await therapist.save();
            }

            return {
                status: true,
                data: savedAppointment,
            };
        } catch (error: any) {
            console.error("Error saving appointment:", error);
            return {
                status: false,
                message: "Failed to save the appointment",
            };
        }
    },

    WalletPaymentSave: async ({
        therapistId,
        userId,
        slot,
        notes,
        totalAmount,
    }: {
        therapistId: string;
        userId: string;
        slot: Date | string;
        notes?: string;
        totalAmount: number;
    }) => {
        try {
            console.log("Initiating wallet payment save...");
            console.log("total amount...", totalAmount);

            // Convert `slot` to a `Date` object if it's a string
            const slotDate =
                typeof slot === "string" ? new Date(slot) : (slot as Date);

            // Check if the slot is already booked
            const existingAppointment = await databaseSchema.Appointment.findOne({
                therapistId,
                slot: slotDate,
                status: { $ne: "cancelled" },
            });


            if (existingAppointment) {
                return {
                    status: false,
                    message:
                        "The slot is already booked. Please choose a different slot.",
                };
            }

            //Fetching user wallet
            const userWallet = await databaseSchema.Wallet.findOne({ userId });
            if (!userWallet) {
                return { status: false, message: "user wallet not found" };
            }


            // check if wallet balance if sufficient
            let amount = totalAmount - 80;
            if (userWallet.balance < totalAmount) {
                return { status: false, message: "Insufficient wallet balance" };
            }

            // Create wallet payment details
            const walletPaymentDetails: any = {
                userId,
                therapistId,
                amount: amount,
                totalAmount: totalAmount,
                paymentMethod: "wallet",
                paymentStatus: "success",
                paymentDate: new Date(),
            };

            // Save payment details in the Payment collection
            const walletPayment = new databaseSchema.Payment(walletPaymentDetails);
            console.log(" wallet payment:", walletPayment);
            const savedWalletPayment = await walletPayment.save();

            console.log("Saved wallet payment:", savedWalletPayment);

            // Create the appointment object
            const appointmentData: any = {
                therapistId,
                userId,
                slot: slotDate,
                notes,
                payment: {
                    userId: savedWalletPayment.userId,
                    therapistId: savedWalletPayment.therapistId,
                    amount: savedWalletPayment.amount,
                    totalAmount: savedWalletPayment.totalAmount,
                    paymentMethod: savedWalletPayment.paymentMethod,
                    paymentStatus: savedWalletPayment.paymentStatus,
                    paymentDate: savedWalletPayment.paymentDate,
                },
            };

            // Save the appointment
            const newAppointment = new databaseSchema.Appointment(appointmentData);
            const savedAppointment = await newAppointment.save();

            // Update therapist's booked slots
            const therapist = await databaseSchema.Therapist.findById(therapistId);
            if (therapist) {
                const bookedSlot = {
                    date: slotDate.toISOString().split("T")[0],
                    time: `${slotDate.getUTCHours() % 12 || 12}:00 ${slotDate.getUTCHours() >= 12 ? "PM" : "AM"
                        }`,
                    status: true,
                };
                therapist.booked.push(bookedSlot);
                await therapist.save();
            }

            // updating user's wallet
            userWallet.balance -= totalAmount;
            await userWallet.save();

            return {
                status: true,
                data: savedAppointment,
            };
        } catch (error: any) {
            console.error("Error in WalletPaymentSave:", error);
            return {
                status: false,
                message:
                    "Failed to process the wallet payment and save the appointment.",
            };
        }
    },

    bookingDetails: async ({ bookingId }: { bookingId: string }) => {
        try {
            const response = await databaseSchema.Appointment.findById(bookingId);
            return response;
        } catch (error: any) {
            return { status: false, message: "Failed to find booking details" };
        }
    },

    cancelAppointment: async ({
        bookingId,
        userId,
    }: {
        bookingId: string;
        userId: string;
    }) => {
        try {
            const appointment = await databaseSchema.Appointment.findById(bookingId);

            if (!appointment) {
                return {
                    status: false,
                    message: "Appointment not found or invalid details",
                };
            }

            if (appointment.status === "cancelled") {
                return { status: false, message: "Appointment already cancelled" };
            }

            appointment.status = "cancelled";
            await appointment.save();

            const userWallet = await databaseSchema.Wallet.findOne({ userId });

            if (!userWallet) {
                return { status: false, message: "user wallet not found" };
            }

            const refundAmount = appointment.payment?.amount;

            if (!refundAmount) {
                return { status: false, message: "Refund amount not found" };
            }

            userWallet.balance += refundAmount;

            userWallet.transactionHistory.push({
                type: "refund",
                amount: refundAmount,
                date: new Date(),
            });

            await userWallet.save();

            return {
                status: true,
                message:
                    "Appointment cancelled successfuly and amount refunded successfully",
            };
        } catch (error) {
            return {
                status: false,
                message: "Failed to cancel appointment and refund amount",
            };
        }
    },

    getAllBooking: async (userId: string, page: number, limit: number) => {
        try {
            const skip = (page - 1) * limit;

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const bookings = await databaseSchema.Appointment.find({
                userId: userId,
                status: "scheduled",
                slot: { $gte: currentDate },
            })
                .skip(skip)
                .limit(limit);

            // Fetch therapist details for each booking
            const bookingWithTherapists = await Promise.all(
                bookings.map(async (booking: any) => {
                    const therapistDetails = await databaseSchema.Therapist.findById(
                        booking.therapistId
                    );
                    return {
                        ...booking._doc,
                        therapist: therapistDetails,
                    };
                })
            );

            const totalBookings = await databaseSchema.Appointment.countDocuments({
                userId: userId,
                status: "scheduled",
                slot: { $gte: currentDate },
            });

            return {
                status: true,
                data: {
                    bookings: bookingWithTherapists,
                    total: totalBookings,
                    currentPage: page,
                    totalPages: Math.ceil(totalBookings / limit),
                },
            };
        } catch (error: any) {
            return { status: false, message: "Failed to find all booking details" };
        }
    },

    getCompletedBooking: async (userId: string, page: number, limit: number) => {
        try {
            const skip = (page - 1) * limit;
            const bookings = await databaseSchema.Appointment.find({
                userId: userId,
                status: "completed",
            })
                .skip(skip)
                .limit(limit);

            // Fetch therapist details for each booking
            const bookingWithTherapists = await Promise.all(
                bookings.map(async (booking: any) => {
                    const therapistDetails = await databaseSchema.Therapist.findById(
                        booking.therapistId
                    );
                    return {
                        ...booking._doc,
                        therapist: therapistDetails,
                    };
                })
            );

            const totalBookings = await databaseSchema.Appointment.countDocuments({
                userId: userId,
                status: "completed",
            });

            return {
                status: true,
                data: {
                    bookings: bookingWithTherapists,
                    total: totalBookings,
                    currentPage: page,
                    totalPages: Math.ceil(totalBookings / limit),
                },
            };
        } catch (error: any) {
            return { status: false, message: "Failed to find all booking details" };
        }
    },

    getCancelledBooking: async (userId: string, page: number, limit: number) => {
        try {
            const skip = (page - 1) * limit;
            const bookings = await databaseSchema.Appointment.find({
                userId: userId,
                status: "cancelled",
            })
                .skip(skip)
                .limit(limit);

            // Fetch therapist details for each booking
            const bookingWithTherapists = await Promise.all(
                bookings.map(async (booking: any) => {
                    const therapistDetails = await databaseSchema.Therapist.findById(
                        booking.therapistId
                    );
                    return {
                        ...booking._doc,
                        therapist: therapistDetails,
                    };
                })
            );

            const totalBookings = await databaseSchema.Appointment.countDocuments({
                userId: userId,
                status: "cancelled",
            });

            return {
                status: true,
                data: {
                    bookings: bookingWithTherapists,
                    total: totalBookings,
                    currentPage: page,
                    totalPages: Math.ceil(totalBookings / limit),
                },
            };
        } catch (error: any) {
            return { status: false, message: "Failed to find all booking details" };
        }
    },

    getSearchResult: async (searchTerm: string) => {
        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { specialization: { $regex: searchTerm, $options: "i" } },
            ],
        };

        try {
            const therapists = await databaseSchema.Therapist.find(filter);
            return therapists;
        } catch (error) {
            return { status: false, message: "Failed to fetch search results" };
        }
    },

    getChildTherapistSearchResult: async (searchTerm: string) => {
        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { specialization: { $regex: searchTerm, $options: "i" } },
            ],
        };

        try {
            const therapists = await databaseSchema.Therapist.find(filter);
            return therapists;
        } catch (error) {
            return {
                status: false,
                message: "Failed to fetch search child therapists",
            };
        }
    },

    getCoupleTherapistSearchResult: async (searchTerm: string) => {
        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { specialization: { $regex: searchTerm, $options: "i" } },
            ],
        };
        try {
            const therapists = await databaseSchema.Therapist.find(filter);
            return therapists;
        } catch (error) {
            return {
                status: false,
                message: "Failed to fetch search couple therapists",
            };
        }
    },

    getFamilyTherapistSearchResult: async (searchTerm: string) => {
        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { specialization: { $regex: searchTerm, $options: "i" } },
            ],
        };

        try {
            const therapists = await databaseSchema.Therapist.find(filter);
            return therapists;
        } catch (error) {
            return {
                status: false,
                message: "Failed to fetch search family therapists",
            };
        }
    },

    getIndividualTherapistSearchResult: async (searchTerm: string) => {
        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { specialization: { $regex: searchTerm, $options: "i" } },
            ],
        };
        try {
            const therapists = await databaseSchema.Therapist.find(filter);
            return therapists;
        } catch (error) {
            return {
                status: false,
                message: "Failed to fetch search individual therapists",
            };
        }
    },

    getSortedTherapists: async ({ sortCriteria, page, limit }: { sortCriteria: any, page: number, limit: number }) => {
        try {
            const skip = (page - 1) * limit;

            const sortedTherapists = await databaseSchema.Therapist.find({
                specialization: "Child Therapy",
                isVerified: true,
            }).sort(sortCriteria).skip(skip).limit(limit).lean();

            const totalTherapist = await databaseSchema.Therapist.countDocuments({
                specialization: "Child Therapy",
                isVerified: true,
            })

            return {
                status: true,
                data: {
                    sortedTherapists,
                    total: totalTherapist,
                    currentPage: page,
                    totalPages: Math.ceil(totalTherapist / limit)
                }
            }
        } catch (error) {
            return { status: false, message: "Error fetching sorted therapists" };
        }
    },

    getSortedFamilyTherapists: async ({ sortCriteria, page, limit }: { sortCriteria: any, page: number, limit: number }) => {
        try {
            const skip = (page - 1) * limit;

            const sortedFamilyTherapists = await databaseSchema.Therapist.find({
                specialization: "Family Therapy",
                isVerified: true,
            }).sort(sortCriteria).skip(skip).limit(limit).lean();

            const totalTherapist = await databaseSchema.Therapist.countDocuments({
                specialization: 'Family Therapy',
                isVerified: true,
            })

            return {
                status: true,
                data: {
                    sortedFamilyTherapists,
                    total: totalTherapist,
                    currentPageFamily: page,
                    totalPagesFamily: Math.ceil(totalTherapist / limit)
                }
            }
        } catch (error) {
            return {
                status: false,
                message: "Error fetching sorted family therapists",
            };
        }
    },

    getSortedIndividualTherapists: async ({ sortCriteria, page, limit }: { sortCriteria: any, page: number, limit: number }) => {
        try {
            const skip = (page - 1) * limit;

            const sortedIndividualTherapists = await databaseSchema.Therapist.find({
                specialization: "Individual Therapy",
                isVerified: true,
            }).sort(sortCriteria).skip(skip).limit(limit).lean();

            const totalTherapist = await databaseSchema.Therapist.countDocuments({
                specialization: 'Individual Therapy',
                isVerified: true,
            })

            return {
                status: true,
                data: {
                    sortedIndividualTherapists,
                    total: totalTherapist,
                    currentPagesIndividual: page,
                    totalPagesIndividual: Math.ceil(totalTherapist / limit)
                }
            }
        } catch (error) {
            return {
                status: false,
                message: "Error fetching sorted individual therapists",
            };
        }
    },

    getSortedCoupleTherapists: async ({ sortCriteria, page, limit }: { sortCriteria: any, page: number, limit: number }) => {
        try {
            const skip = (page - 1) * limit;

            const sortedCoupleTherapists = await databaseSchema.Therapist.find({
                specialization: "Couple Therapy",
                isVerified: true,
            }).sort(sortCriteria).skip(skip).limit(limit).lean();

            const totalTherapist = await databaseSchema.Therapist.countDocuments({
                specialization: 'Couple Therapy',
                isVerified: true,
            })

            return {
                status: true,
                data: {
                    sortedCoupleTherapists,
                    total: totalTherapist,
                    currentPagesCouple: page,
                    totalPagesCouple: Math.ceil(totalTherapist / limit)
                }
            }
        } catch (error) {
            return {
                status: false,
                message: "Error fetching sorted couple therapists",
            };
        }
    },

    savePayment: async (paymentData: any) => {
        try {
            const result = await databaseSchema.Payment.create(paymentData);

            return { status: true, data: result, paymentId: result._id };
        } catch (error) {
            return { status: false, message: "Failed to save payment" };
        }
    },

    walletDetails: async ({ userId }: { userId: string }) => {
        try {
            const result = await databaseSchema.Wallet.findOne({ userId });

            if (!result) {
                return { status: false, message: "Wallet not found" };
            }
            return { status: true, data: result };
        } catch (error) {
            return { status: false, message: "Failed to retrieve wallet details" };
        }
    },

    getSubmitIssue: async ({
        userId,
        bookingId,
        description,
        category,
        status,
        rating,
    }: {
        userId: string;
        therapistId: string;
        bookingId: string;
        description: string;
        category: string;
        status: string;
        rating: number;
    }) => {
        try {
            const booking = await databaseSchema.Appointment.findById(bookingId);

            if (!booking) {
                return { status: false, message: "Booking not found" };
            }

            // Update the booking status to 'completed'
            booking.status = "completed";
            await booking.save();

            const { therapistId } = booking;

            const newIssue = new databaseSchema.Issue({
                userId,
                bookingId,
                therapistId,
                description,
                category,
                rating,
                status,
            });

            const result = await newIssue.save();
            return { status: true, data: result };
        } catch (error) {
            console.error("Error in saving submit issue:", error);
            return { status: false, message: "Failed to save issue" };
        }
    },
};
