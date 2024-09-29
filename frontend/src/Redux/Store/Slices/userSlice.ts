import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../AxiosConfig/AxiosConfig";
import { USERREGISTER,
    GOOGLEREGISTER,
    VERIFYOTP,
    USERLOGIN,
    FORGOTPASSWORD,
    FORGOTPASSWORDOTP,
    PASSWORDRESET,
    RESENDOTP,
    GETUSERPROFILE,
    GETCHILDTHERAPIST,
    GETSLOTS,
    BOOKEDSLOTS,
    SAVEAPPOINTMENT,
    GETBOOKINGDETAILS,
    GETSCHEDULEDBOOKINGS,
    GETCOMPLETEDBOOKINGS,
    GETCANCELLEDBOOKINGS,
    SEARCHTHERAPIST
 } from "../../../Services/userApi";




interface User {
    userId: string;
    name: string;
    email: string;
    mobile: string;
}

interface RegisterResponse {
    user: User;
    token: string
}

interface LoginResponse {
    token: string;
    user: User
}


interface ForgotPasswordResponse {
    status: boolean;
    message: string;
}

interface Therapist {
    fees: number;
    _id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    professionalExperience: number;
    photo: string;
    availableSlots: string[];
    bookedSlots: string[]
    timings: {
        startTime: string;
        endTime: string
    }[]
}


interface PasswordResetPayload {
    newPassword: string;
    confirmPassword: string;
}

export interface Booking {
    _id: string;
    therapistId: string;
    slot: string;
    status: string;
}

interface AppointmentState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
}

interface UserState {
    user: User | null;
    therapists: Therapist[];
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    loading: boolean;
    otpVerified: boolean;
    otpError: string | null;
    isAuthenticated: boolean;
    resetPasswordStatus: string | null;
    resetPasswordError: string | null;
    resetPasswordSuccess: string | null;
    loginError: string | null;
    forgotPasswordStatus : 'idle' | 'loading' | 'succeeded' | 'failed';
    forgotPasswordError: string | null;
    forgotPasswordSuccess: string | null;
    availableSlots: string[];
    bookedSlots: string[];
    timings: any[] 
    appointmentData: any
    appointmentStatus: string | null
    appointmentError: string | null
    scheduledBookings: Booking[];
    completedBookings: Booking[];
    cancelledBookings: Booking[];
    bookings: Booking[];
    totalPages: number
    currentPage: number
    completedTotalPages: number
    completedCurrentPage: number
    cancelledTotalPages: number
    cancelledCurrentPage: number
   
}


const initialState: UserState = {
    user: null,
    therapists: [],
    token: localStorage.getItem('token'),
    status: 'idle',
    error: null,
    loading: false,
    otpVerified: false,
    otpError: null,
    isAuthenticated: false,
    resetPasswordStatus: 'idle',
    resetPasswordError: null,
    resetPasswordSuccess: null,
    loginError: null,
    forgotPasswordStatus: 'idle',
    forgotPasswordError: null,
    forgotPasswordSuccess: null,
    availableSlots: [],
    bookedSlots: [],
    timings: [],
    appointmentData: null,
    appointmentStatus: null,
    appointmentError: null,
    scheduledBookings: [],
    completedBookings: [],
    cancelledBookings: [],
    bookings:[],
    totalPages: 0,
    currentPage: 0,
    completedTotalPages: 0,
    completedCurrentPage: 0,
    cancelledCurrentPage: 0,
    cancelledTotalPages: 0
}   

export const registerUser = createAsyncThunk<RegisterResponse, {name: string, email: string, mobile:string, password: string}, {rejectValue: string}>(
    'user/registerUser',
    async (userData, thunkAPI) => {
        try {

            const response = await axiosInstance.post( USERREGISTER, userData);

            console.log("response:", response);

            localStorage.setItem('otpToken', response.data.token);
            return response.data;
        } catch (error: any) {

            const message = error.response?.data?.data || "An error occured"
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const googleRegister = createAsyncThunk<{token: string; user: User}, any, {rejectValue:string}>(
    'user/googleRegister',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post( GOOGLEREGISTER, userData);


            const { token } = response.data;
            console.log("Token received from RegisterUser slice:", token);

            // Decode the payload from the JWT token manually
            const base64Url = token.split('.')[1];

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);
            console.log("Decoded token:", decoded);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(decoded));
            return { token, user: decoded };

        } catch (error: any) {
            const message = error.response?.data?.data || "An error occured"
            return thunkAPI.rejectWithValue(message);
        }
    }
)


//Async thunk for OTP verification
export const verifyOtp = createAsyncThunk<{status: boolean}, string, {rejectValue: string}>(
    'user/verifyOtp',
    async (otp, thunkAPI) => {
        try {
            const token = localStorage.getItem('otpToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post( VERIFYOTP, { otp }, config);

            if (response.data.status) {
                localStorage.removeItem('otpToken');
                return response.data;
            } else {
                return thunkAPI.rejectWithValue(response.data.message);
            }

        } catch (error: any) {
            return thunkAPI.rejectWithValue('Error verifying otp');
        }
    }
)

export const resendOtp = createAsyncThunk<{status: boolean; message: string; token: string}, void, { rejectValue: string}>(
    "user/resendOtp",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("otpToken");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(RESENDOTP, {}, config);
            if(response.data.status) {
                return response.data;
            } else {
                return thunkAPI.rejectWithValue(response.data.message);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue("Error resending OTP");
        }
    }
)


export const loginUser = createAsyncThunk<LoginResponse, {email: string, password: string}, {rejectValue:string}>(
    'user/loginUser',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(USERLOGIN, userData);

            const { token } = response.data;
            console.log("Token received from loginUser slice:", token);

            // Decode the payload from the JWT token manually
            const base64Url = token.split('.')[1];

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);
            console.log("Decoded token:", decoded);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(decoded));
            return { token, user: decoded };
        } catch (error: any) {
            const message = error.response?.data?.message || "Login failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

//forgot password
export const forgotPassword = createAsyncThunk<ForgotPasswordResponse, string, {rejectValue:string}>(
    'user/forgotPassword',
    async (email, thunkAPI) => {
        console.log("sending email for password reset:", email);
        try {
            const response = await axios.post(FORGOTPASSWORD, {email});
            const token = response.data.token;

            console.log("token recieved and saved:", token);
            localStorage.setItem('newToken', token);
           
            return response.data;
        } catch (error:any) {
            const message = error.response?.data?.message || "An error occurred";
            return thunkAPI.rejectWithValue(message);
        }
    }
)

//Async thunk for OTP verification
export const verifyForgotPasswordOTP = createAsyncThunk<{status: boolean}, string, {rejectValue: string}>(
    'user/verifyForgotPasswordOTP',
    async (otp, thunkAPI) => {
        try {
            const token = localStorage.getItem('newToken');
            console.log("Token retrieved for verification:", token);
            if(!token) {
                return thunkAPI.rejectWithValue('Token is missing or invalid');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(FORGOTPASSWORDOTP, { otp }, config);
            console.log("response from verifyforgotot slice:", response);

            if (response.data.status) {
                return response.data;
            } else {
                return thunkAPI.rejectWithValue(response.data.message);
            }

        } catch (error: any) {
            return thunkAPI.rejectWithValue('Error verifying otp');
        }
    }
)

// password reset
export const PasswordResetSlice = createAsyncThunk<ForgotPasswordResponse, PasswordResetPayload, {rejectValue:string}>(
    'user/passwordReset',
    async (passwordData, thunkAPI) => {
        console.log("password data:", passwordData);
        try {
            const token = localStorage.getItem("token");
            console.log("Token retrieved for password reset:", token);
            if(!token) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            const response = await axios.post(PASSWORDRESET, passwordData, config);
            console.log("response from user slice:", response);
            return response.data;
        } catch (error:any) {
            const message = error.response?.data?.message || "An error occurred";
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const fetchUserProfile = createAsyncThunk<User, void, {rejectValue: string}>(
    "user/fetchuserProfile",
    async(_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            console.log("token recieved:", token);

            if(!token) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }


            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const response = await axiosInstance.get(GETUSERPROFILE, config);
            console.log("response from user slice:", response);
            console.log("response data data user", response.data.data.user);
            return response.data.data.user;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch profile";
            return thunkAPI.rejectWithValue(message);
        }
    }
) 

export const fetchChildTherapist = createAsyncThunk<Therapist[], void, {rejectValue: string}>(
    'user/fetchChildTherapist',
    async(_, thunkAPI) => {
        try {
            const response = await axiosInstance.get(GETCHILDTHERAPIST);
            console.log("Response from fetch child therapist slice:", response);
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch child therapists';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const fetchAvailableSlots = createAsyncThunk<{ availableSlots: string[], timings: any[] }, string, { rejectValue: string}>(
    'user/fetchAvailableSlots',
    async(therapistId, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`${GETSLOTS}/${therapistId}`);
            console.log("response from fetch availble slots:", response);
            console.log("response.data.data.availableSlots:", response.data.data.availableSlots)
            return {
                availableSlots: response.data.data.availableSlots,
                timings: response.data.data.timings
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch available slots";
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const fetchBookedSlots = createAsyncThunk<{ bookedSlots: string[] }, string, { rejectValue: string}>(
    'user/fetchBookedSlotes',
    async(therapistId, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`${BOOKEDSLOTS}/${therapistId}`);
            console.log("response from fetch booked slots:", response);

            return {
                bookedSlots: response.data.data
                
            }
            
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch available slots";
            return thunkAPI.rejectWithValue(message);
        }
    }
)



export const saveAppointment = createAsyncThunk<
    { success: boolean; appointmentData: any }, 
    { therapistId: string; userId: string; slot: Date; notes: string },
    { rejectValue: string } 
>(
    'user/saveAppointment',
    async ({ therapistId, userId, slot, notes }, thunkAPI) => {
        try {
            const response = await axiosInstance.post(SAVEAPPOINTMENT, { therapistId, userId, slot, notes });

            console.log("response from save appointment:", response);

            // Returning the appointment data upon success
            return {
                success: true,
                appointmentData: response.data.data
            };
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to save appointment";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getBookingDetails = createAsyncThunk<{success: boolean, bookingData: any}, {bookingId: string}, { rejectValue: string}>(
    'user/bookingDetails',
    async ({ bookingId}, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`${GETBOOKINGDETAILS}/${bookingId}`);
            console.log("response from booking details slice....:", response);
            
            return {
                success: true,
                bookingData: response.data
            }
        } catch (error: any) {
            const message = error?.data?.message || "Failed to fetch booking details";
            return thunkAPI.rejectWithValue(message);
        }
    }
)




export const fetchScheduledBookingDetails = createAsyncThunk<{
    bookings: Booking[]; 
    totalPages: number;
    currentPage: number;
    }, 
    {  page: number; limit: number}, 
    {rejectValue: string}>(
    "user/fetchScheduledBookingDetails",
    async({ page, limit }, thunkAPI) => {
        console.log("fetching page:", page,  "with limit:", limit);
        try {
            const token = localStorage.getItem("token");
            console.log("token received:", token);

            if(!token) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const response = await axiosInstance.get(`${GETSCHEDULEDBOOKINGS}?page=${page}&limit=${limit}`, config);
            console.log("response data.data...", response.data.data);

            return {
                bookings: response.data.data.data.bookings,
                totalPages: response.data.data.data.totalPages,
                currentPage: response.data.data.data.currentPage,
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch profile";
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const fetchCompletedBookingDetails = createAsyncThunk<{
    bookings: Booking[]; 
    totalPages: number;
    currentPage: number;
    }, 
    {  page: number; limit: number}, 
    {rejectValue: string}>(
    "user/fetchCompletedBookingDetails",
    async({ page, limit }, thunkAPI) => {
        console.log("fetching page:", page,  "with limit:", limit);
        try {
            const token = localStorage.getItem("token");
            console.log("token received:", token);

            if(!token) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const response = await axiosInstance.get(`${GETCOMPLETEDBOOKINGS}?page=${page}&limit=${limit}`, config);
            console.log("response data.data...", response.data.data);

            return {
                bookings: response.data.data.data.bookings,
                totalPages: response.data.data.data.totalPages,
                currentPage: response.data.data.data.currentPage,
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch profile";
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const fetchCancelledBookingDetails = createAsyncThunk<{
    bookings: Booking[]; 
    totalPages: number;
    currentPage: number;
    }, 
    {  page: number; limit: number}, 
    {rejectValue: string}>(
    "user/fetchCancelledBookingDetails",
    async({ page, limit }, thunkAPI) => {
        console.log("fetching page:", page,  "with limit:", limit);
        try {
            const token = localStorage.getItem("token");
            console.log("token received:", token);

            if(!token) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const response = await axiosInstance.get(`${GETCANCELLEDBOOKINGS}?page=${page}&limit=${limit}`, config);
            console.log("response data.data...", response.data.data);

            return {
                bookings: response.data.data.data.bookings,
                totalPages: response.data.data.data.totalPages,
                currentPage: response.data.data.data.currentPage,
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch profile";
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const fetchTherapistBySearchTerm = createAsyncThunk(
    "therapist/fetchTherapistsBySeachTerm",
    async (searchTerm: string, { rejectWithValue}) => {
        try {
            const response = await axios.get(SEARCHTHERAPIST, { params: {search: searchTerm}});
            console.log("response from search therapist slice:", response.data.data);

            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch therapist")
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
        clearError: (state) => {
            state.loginError = null;
            state.error = null;
        },
        clearAppointmentStatus:(state) => {
            state.appointmentStatus = null;
            state.appointmentError = null;
        },
        setBookings: (state, action: PayloadAction<Booking[]>) => {
            state.bookings = action.payload;
        },
        clearBookings: (state) => {
            state.scheduledBookings = [];
            state.cancelledBookings = [];
            state.completedBookings = [];
        },
        resetSearchResults: (state) => {
            state.therapists = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || "Registration failed";
            })
            .addCase(verifyOtp.pending, (state) => {
                state.otpVerified = false;
                state.otpError = null;
            })
            .addCase(verifyOtp.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.otpVerified = true;
                state.otpError = action.payload || "OTP verification failed"
            })
            .addCase(googleRegister.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(googleRegister.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.otpVerified = false;
            })
            .addCase(googleRegister.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || "Google registration failed";
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.loginError = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loginError = null;
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.loginError = action.payload || "Login failed";
                state.isAuthenticated = false;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.forgotPasswordStatus = 'loading';
                state.forgotPasswordError = null;
                state.forgotPasswordSuccess = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<ForgotPasswordResponse>) => {
                state.forgotPasswordStatus = 'succeeded';
                state.forgotPasswordSuccess = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.forgotPasswordStatus = 'failed';
                state.forgotPasswordError = action.payload || "Forgot password request failed";
            })
            .addCase(verifyForgotPasswordOTP.pending, (state) => {
                state.otpVerified = false;
                state.otpError = null;
            })
            .addCase(verifyForgotPasswordOTP.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.otpVerified = true;
                state.otpError = action.payload || "OTP verification failed"
            })
            .addCase(PasswordResetSlice.pending, (state) => {
                state.resetPasswordStatus = 'loading';
                state.resetPasswordError = null;
                state.resetPasswordSuccess = null;
            })
            .addCase(PasswordResetSlice.fulfilled, (state, action: PayloadAction<ForgotPasswordResponse>) => {
                state.resetPasswordStatus = 'succeeded';
                state.resetPasswordSuccess = action.payload.message;
            })
            .addCase(PasswordResetSlice.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.resetPasswordStatus = 'failed';
                state.resetPasswordError = action.payload || "Password reset failed";
            })
            .addCase(fetchChildTherapist.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchChildTherapist.fulfilled, (state, action: PayloadAction<Therapist[]>) => {
                state.status = 'succeeded';
                state.therapists = action.payload; 
            })
            .addCase(fetchChildTherapist.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || "Failed to fetch therapists";
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                console.log("Updated user in Redux:", state.user);
            })
            .addCase(fetchAvailableSlots.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
                state.loading = false;
                state.availableSlots = action.payload.availableSlots;
                state.timings = action.payload.timings;
               
            })
            .addCase(fetchAvailableSlots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchBookedSlots.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookedSlots.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action paylod from fetch booked:", action.payload);
                
                state.bookedSlots = action.payload.bookedSlots
            })
            .addCase(saveAppointment.pending, (state) => {
                state.loading = true;
                state.appointmentStatus = null;
                state.error = null;
            })
            .addCase(saveAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.appointmentData = action.payload.appointmentData;
                state.appointmentStatus = 'success'
                state.appointmentError = null;
            })
            .addCase(saveAppointment.rejected, (state, action) => {
                state.loading = false;
                state.appointmentStatus = 'failed';
                state.appointmentError = action.payload as string
            })
            .addCase(fetchScheduledBookingDetails.fulfilled, (state, action: PayloadAction<{
                bookings: Booking[];
                totalPages: number;
                currentPage: number;
            }>) => {
                const { bookings, totalPages, currentPage } = action.payload;
            
                // Reset only the scheduledBookings, since you are fetching only scheduled ones
                state.scheduledBookings = [];
            
                // Loop through bookings and only add scheduled ones
                bookings.forEach((booking) => {
                    if (booking.status === "scheduled") {
                        state.scheduledBookings.push(booking);
                    }
                });
            
                // Set pagination details
                state.totalPages = totalPages; 
                state.currentPage = currentPage;
            
                console.log("updated scheduledBookings state:", state.scheduledBookings);
            })
            .addCase(fetchCompletedBookingDetails.fulfilled, (state, action: PayloadAction<{
                bookings: Booking[];
                totalPages: number;
                currentPage: number;
            }>) => {
                const { bookings, totalPages, currentPage } = action.payload;
            
                // Reset only the scheduledBookings, since you are fetching only scheduled ones
                state.completedBookings = [];
            
                // Loop through bookings and only add scheduled ones
                bookings.forEach((booking) => {
                    if (booking.status === "completed") {
                        state.completedBookings.push(booking);
                    }
                });
            
                // Set pagination details
                state.completedTotalPages = totalPages; 
                state.completedCurrentPage = currentPage;
            
                console.log("updated completed Bookings state:", state.completedBookings);
            })
            .addCase(fetchCancelledBookingDetails.fulfilled, (state, action: PayloadAction<{
                bookings: Booking[];
                totalPages: number;
                currentPage: number;
            }>) => {
                const { bookings, totalPages, currentPage } = action.payload;
            
                
                state.cancelledBookings = [];
            
                // Loop through bookings and only add scheduled ones
                bookings.forEach((booking) => {
                    if (booking.status === "cancelled") {
                        state.cancelledBookings.push(booking);
                    }
                });
            
                // Set pagination details
                state.cancelledTotalPages = totalPages; 
                state.cancelledCurrentPage = currentPage;
            
                console.log("updated cancelled Bookings state:", state.cancelledBookings);
            })
            .addCase(fetchScheduledBookingDetails.pending, (state) => {
                state.scheduledBookings = []; 
            })
            .addCase(fetchCompletedBookingDetails.pending, (state) => {
                state.completedBookings = []; 
            })
            .addCase(fetchCancelledBookingDetails.pending, (state) => {
                state.cancelledBookings = []; 
            })
            .addCase(fetchTherapistBySearchTerm.pending, (state) => {
                state.status = 'loading'; 
            })
            .addCase(fetchTherapistBySearchTerm.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.therapists = action.payload; 
            })
            .addCase(fetchTherapistBySearchTerm.rejected, (state, action) => {
                state.status = 'failed'; 
                state.error = null; 
            });
                      
            
    }
})

export const { logoutUser, clearError, clearAppointmentStatus, clearBookings, resetSearchResults } = userSlice.actions;

export default userSlice.reducer;