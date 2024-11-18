import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";
import axiosInstance from "../../../AxiosConfig/AxiosConfig";
import { setAuthInfo } from "../../../AxiosConfig/AxiosConfig";
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
    SEARCHTHERAPIST,    
    SEARCHCHILDTHERAPIST,
    SORTCHILDTHERAPIST,
    PAYMENTMETHOD,
    VERIFYPAYMENT,
    JOINSESSION,
    CANCELAPPOINTMENT,
    GEMINIAPI,
    CHANGEPASSWORD,
    WALLETDETAILS,
    SUBMITISSUE,
    GETFAMILYTHERAPIST,
    SEARCHFAMILYTHERAPIST,
    SORTFAMILYTHERAPIST,
    GETINDIVIDUALTHERAPIST,
    SORTINDIVIDUALTHERAPIST,
    SEARCHINDIVIDUALTHERAPIST,
    GETCOUPLETHERAPIST,
    SORTCOUPLETHERAPIST,
    CHECKSLOTBEFOREPAYMENT,
    SEARCHCOUPLETHERAPIST,
    WALLETPAYMENT
 } from "../../../Services/userApi";
import { act } from "react";




interface User {
    _id: string;
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
    gender: string;
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
    }[];
    
}



interface PasswordResetPayload {
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordPayload {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface Booking {
    therapist: any;
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

interface Transaction {
    type: 'credit' | 'debit' | 'refund';
    amount: number;
    status: string;
    date: string;
}

interface walletData {
    balance: number;
    currency: string;
    transactionHistory: Transaction[]
    userId: string;
    _id: string;
}


interface submitIssuePayload {
    userId: string;
    bookingId: string;
    category: string;
    description: string;
    status: string;
}


interface UserState {
    userId: any;
    user: User | null;
    search_Result: string | null;
    therapists: Therapist[]; 
    familyTherapists: Therapist[]; 
    coupleTherapists: Therapist[]; 
    individualTherapists: Therapist[]; 
    familyTherapistsSearch: Therapist[];
    individualTherapistsSearch: Therapist[];
    childTherapistsSearch: Therapist[];
    coupleTherapistsSearch: Therapist[],
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
    booked: any[]
    issues:any[]
    sortedTherapists: Therapist[]
    sortedFamilyTherapists: Therapist[]
    sortedIndividualTherapists: Therapist[]
    sortedCoupleTherapists: Therapist[]
    appointmentData: any
    appointmentStatus: string | null
    appointmentError: string | null
    scheduledBookings: Booking[];
    completedBookings: Booking[];
    cancelledBookings: Booking[];
    bookings: Booking[];
    totalPages: number
    currentPage: number
    totalPagesFamily: number
    currentPagesFamily: number
    totalPagesIndividual: number
    currentPagesIndividual: number
    completedTotalPages: number
    completedCurrentPage: number
    cancelledTotalPages: number
    cancelledCurrentPage: number;
    totalPagesCouple: number;
    currentPagesCouple: number;
    total: number;
    walletData: walletData | null;
}


const initialState: UserState = {
    userId: null,
    user: null,
    search_Result : null,
    therapists: [],
    familyTherapists: [],
    individualTherapists:[],
    coupleTherapists: [],
    familyTherapistsSearch: [],
    individualTherapistsSearch: [],
    childTherapistsSearch: [],
    coupleTherapistsSearch: [],
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
    booked: [],
    issues: [],
    sortedTherapists: [],
    sortedFamilyTherapists: [],
    sortedIndividualTherapists:[],
    sortedCoupleTherapists: [],
    appointmentData: null,
    appointmentStatus: null,
    appointmentError: null,
    scheduledBookings: [],
    completedBookings: [],
    cancelledBookings: [],
    bookings:[],
    totalPages: 0,
    currentPage: 0,
    totalPagesFamily: 0,
    currentPagesFamily: 0,
    completedTotalPages: 0,
    completedCurrentPage: 0,
    cancelledCurrentPage: 0,
    cancelledTotalPages: 0,
    currentPagesIndividual: 0,
    totalPagesIndividual: 0,
    totalPagesCouple: 0,
    currentPagesCouple: 0,
    total: 0,
    walletData: null
}   

export const registerUser = createAsyncThunk<RegisterResponse, {name: string, email: string, mobile:string, password: string}, {rejectValue: string}>(
    'user/registerUser',
    async (userData, thunkAPI) => {
        try {

            const response = await axiosInstance.post( USERREGISTER, userData);

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
   
            // Decode the payload from the JWT token manually
            const base64Url = token.split('.')[1];

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);

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
            const response = await axios.post(USERLOGIN, userData, { withCredentials: true });

            const { token } = response.data;
     
            // Decode the payload from the JWT token manually
            const base64Url = token.split('.')[1];

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(decoded));

            const refreshToken = response.data.refreshToken;
          
            setAuthInfo(token, decoded.role,'');

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
            if(!token) {
                return thunkAPI.rejectWithValue('Token is missing or invalid');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(FORGOTPASSWORDOTP, { otp }, config);


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
            if(!token) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            const response = await axios.post(PASSWORDRESET, passwordData, config);
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
            const authInfoString = localStorage.getItem("authInfo");

            if (!authInfoString) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }

            const authInfo = JSON.parse(authInfoString);
            const accessToken = authInfo.accessToken;

            if (!accessToken) {
                return thunkAPI.rejectWithValue("Access token is missing or invalid");
            }

            const config = {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
            

            const response = await axiosInstance.get(GETUSERPROFILE, config);
          
            return response.data.data.user;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch profile";
            return thunkAPI.rejectWithValue(message);

        }
    }
) 

export const fetchChildTherapist = createAsyncThunk<{therapists: Therapist[], currentPage: number, totalPages: number}, {page: number; limit: number}, {rejectValue: string}>(
    'user/fetchChildTherapist',
    async({page, limit}, thunkAPI) => {
        try {
            const response = await axios.get(GETCHILDTHERAPIST, { params: {page, limit}});

            const {therapists, currentPage, totalPages} =  response.data.data;
            return { therapists, currentPage, totalPages };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch child therapists';
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const fetchFamilyTherapist = createAsyncThunk<{familyTherapist:Therapist[], currentPagesFamily:number, totalPagesFamily:number}, {page: number; limit: number}, {rejectValue: string}>(
    'user/fetchFamilyTherapist',
    async({page, limit}, thunkAPI) => {
        try {
            const response = await axios.get(GETFAMILYTHERAPIST, { params: {page, limit}});

            const {familyTherapist, currentPagesFamily, totalPagesFamily} =  response.data.data;
            return { familyTherapist, currentPagesFamily, totalPagesFamily };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch family therapists';
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const fetchIndividualTherapist = createAsyncThunk<{individualTherapists:Therapist[], currentPagesIndividual:number, totalPagesIndividual:number}, {page: number; limit: number}, {rejectValue: string}>(
    'user/fetchIndividualTherapist',
    async({page, limit}, thunkAPI) => {
        try {
            const response = await axios.get(GETINDIVIDUALTHERAPIST, { params: {page, limit}});

            const {individualTherapists, currentPagesIndividual, totalPagesIndividual} =  response.data.data;
            return { individualTherapists, currentPagesIndividual, totalPagesIndividual };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch individual therapists';
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const fetchCoupleTherapist = createAsyncThunk<{coupleTherapists: Therapist[], currentPagesCouple: number, totalPagesCouple: number}, {page: number; limit: number}, {rejectValue: string}>(
    'user/fetchCoupleTherapist',
    async({page, limit}, thunkAPI) => {
        try {
            const response = await axios.get(GETCOUPLETHERAPIST, { params: {page, limit}});

            const {coupleTherapists, currentPagesCouple, totalPagesCouple} =  response.data.data;
            return { coupleTherapists, currentPagesCouple, totalPagesCouple };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch couple therapists';
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const fetchAvailableSlots = createAsyncThunk<{
    booked: any[]; availableSlots: string[], timings: any[], issues: any[]
}, string, { rejectValue: string}>(
    'user/fetchAvailableSlots',
    async(therapistId, thunkAPI) => {
        try {
            const response = await axios.get(`${GETSLOTS}/${therapistId}`);
          
            return {
                availableSlots: response.data.data.availableSlots,
                timings: response.data.data.timings,
                booked: response.data.data.booked,
                issues: response.data.data.issues,
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
            const response = await axios.get(`${BOOKEDSLOTS}/${therapistId}`);

            return {
                bookedSlots: response.data.data
                
            }
            
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch available slots";
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const checkSlotBeforePayment = createAsyncThunk<
  { available: boolean },
  { therapistId: string; slotDate: string; slotTime: string }, 
  { rejectValue: string } 
>(
  "user/checkSlotBeforePayment",
  async ({ therapistId, slotDate, slotTime }, thunkAPI) => {
    try {
      
        const response = await axios.get(`${CHECKSLOTBEFOREPAYMENT}/${therapistId}`, 
            {
              params: {
                slotDate,
                slotTime
              }
            }
          );

      
      return response.data; 

    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch available slots";
      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const saveAppointment = createAsyncThunk<
    { success: boolean; appointmentData: any }, 
    { therapistId: string; userId: string; slot: Date; notes: string, paymentId:string },
    { rejectValue: string } 
>(
    'user/saveAppointment',
    async ({ therapistId, userId, slot, notes, paymentId }, thunkAPI) => {
        try {
            const response = await axios.post(SAVEAPPOINTMENT, { therapistId, userId, slot, notes, paymentId });

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


export const paymentMethod = createAsyncThunk<
{success: boolean; appointmentData: any },
{therapistId: string; userId: string; slot: Date; notes: string, totalAmount: number, paymentStatus: string},
{rejectValue:string}
>(
    'user/paymentMethod',
    async ({ therapistId, userId, slot, notes, totalAmount, paymentStatus }, thunkAPI) => {
        try {
            const response = await axios.post(PAYMENTMETHOD, { therapistId, userId, slot, notes, totalAmount, paymentStatus });

            return {
                success: true,
                appointmentData: response.data
            }
            
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to do payment";
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const sendPaymentStatus = createAsyncThunk<
  { success: boolean; verifiedPayment: any }, 
  { therapistId: string; userId: string; razorpayOrderId: string; paymentStatus: string; paymentDetails: any, slot: Date, notes: string, totalAmount: number }, // Parameters
  { rejectValue: string }
>(
  'user/sendPaymentStatus',
  async ({ therapistId, userId, razorpayOrderId, paymentStatus, paymentDetails, slot, notes, totalAmount }, thunkAPI) => {
    try {
      const response = await axios.post(VERIFYPAYMENT, {
        therapistId,
        userId,
        razorpayOrderId,
        paymentStatus,
        paymentDetails,
        slot,
        notes,
        totalAmount
      });

      return {
        success: true,
        verifiedPayment: response.data,
        paymentId: response.data.paymentId
      };

    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to verify payment";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const walletPayment = createAsyncThunk<
    { success: boolean; appointmentData: any },
    { therapistId: string; userId: string; slot: Date; notes: string; totalAmount: number },
    { rejectValue: string }
>(
    'user/walletPayment',
    async ({ therapistId, userId, slot, notes, totalAmount }, thunkAPI) => {
        try {
            const response = await axios.post(WALLETPAYMENT, { therapistId, userId, slot, notes, totalAmount });

            return {
                success: true,
                appointmentData: response.data
            };
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to process wallet payment";
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const getBookingDetails = createAsyncThunk<{success: boolean, bookingData: any}, {bookingId: string}, { rejectValue: string}>(
    'user/bookingDetails',
    async ({ bookingId}, thunkAPI) => {
        try {
            const response = await axios.get(`${GETBOOKINGDETAILS}/${bookingId}`);
             
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
    async({ page, limit, }, thunkAPI) => {
        console.log("fetching page:", page,  "with limit:", limit);
        try {
            
            const authInfoString = localStorage.getItem("authInfo");

            if (!authInfoString) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }

            const authInfo = JSON.parse(authInfoString);
            const accessToken = authInfo.accessToken;

            if (!accessToken) {
                return thunkAPI.rejectWithValue("Access token is missing or invalid");
            }

            const config = {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }

            const response = await axiosInstance.get(`${GETSCHEDULEDBOOKINGS}?page=${page}&limit=${limit}`, config);

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
            const authInfoString = localStorage.getItem("authInfo");
       
            if (!authInfoString) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }

            const authInfo = JSON.parse(authInfoString);
            const accessToken = authInfo.accessToken;

            if (!accessToken) {
                return thunkAPI.rejectWithValue("Access token is missing or invalid");
            }

            const config = {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
            const response = await axiosInstance.get(`${GETCOMPLETEDBOOKINGS}?page=${page}&limit=${limit}`, config);

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
        try {
            const authInfoString = localStorage.getItem("authInfo");

            if (!authInfoString) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }

            const authInfo = JSON.parse(authInfoString);
            const accessToken = authInfo.accessToken;

            if (!accessToken) {
                return thunkAPI.rejectWithValue("Access token is missing or invalid");
            }

            const config = {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
            const response = await axiosInstance.get(`${GETCANCELLEDBOOKINGS}?page=${page}&limit=${limit}`, config);

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
 
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch therapist")
        }
    }
)

export const fetchWalletDetails = createAsyncThunk(
    "user/walletDetails",
    async (userId: string, { rejectWithValue}) => {
        try {
            const response = await axios.get(WALLETDETAILS, {
                params: { userId },  
            });
            
            return response.data.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch wallet details");
            
        }
    }
)


export const fetchChildTherapistBySearchTerm = createAsyncThunk(
    "therapist/fetchChildTherapistsBySeachTerm",
    async (searchTerm: string, { rejectWithValue}) => {
        try {
            const response = await axios.get(SEARCHCHILDTHERAPIST, { params: {search: searchTerm}});

            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch child therapist")
        }
    }
)


export const fetchSortedChildTherapists = createAsyncThunk<
    { sortedTherapists: Therapist[]; currentPage: number; totalPages: number },
    { sortOption: string; page: number; limit: number },
    { rejectValue: string }
>(
    "therapist/fetchSortedChildTherapists",
    async ({ sortOption, page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get(SORTCHILDTHERAPIST, {
                params: { sortBy: sortOption, page, limit },
            });

            // Return the necessary data
            const { sortedTherapists, currentPage, totalPages } = response.data.data.data;
            return { sortedTherapists, currentPage, totalPages };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch sorted child therapists"
            );
        }
    }
);



export const fetchFamilyTherapistBySearchTerm = createAsyncThunk(
    "therapist/fetchFamilyTherapistsBySeachTerm",
    async (searchTerm: string, { rejectWithValue}) => {
        try {
            const response = await axios.get(SEARCHFAMILYTHERAPIST, { params: {search: searchTerm}});

            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch family therapist")
        }
    }
);


export const fetchIndividualTherapistBySearchTerm = createAsyncThunk(
    "therapist/fetchIndividualTherapistsBySeachTerm",
    async (searchTerm: string, { rejectWithValue}) => {
        try {
            const response = await axios.get(SEARCHINDIVIDUALTHERAPIST, { params: {search: searchTerm}});

            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch individual therapist")
        }
    }
);

export const fetchCoupleTherapistBySearchTerm = createAsyncThunk(
    "therapist/fetchCoupleTherapistBySearchTerm",
    async (searchTerm: string, {rejectWithValue}) => {
        try {
            const response = await axios.get(SEARCHCOUPLETHERAPIST, { params: {search: searchTerm}});
            return response.data.data;

        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch couple therapists");
        }
    }
);


export const fetchSortedFamilyTherapists = createAsyncThunk<
{ sortedFamilyTherapists: Therapist[]; currentPageFamily: number; totalPagesFamily: number },
{ sortOption: string; page: number; limit: number },
{ rejectValue: string }
>(
    "therapist/fetchSortedFamilyTherapists",
    async ({sortOption, page, limit}, { rejectWithValue }) => {
        try {
            const response = await axios.get(SORTFAMILYTHERAPIST, { params: {sortBy: sortOption, page, limit } });

            const { sortedFamilyTherapists, currentPageFamily, totalPagesFamily } = response.data.data.data;
            return { sortedFamilyTherapists, currentPageFamily, totalPagesFamily };
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch sorted family therapists");
        }
    }
);


export const fetchSortedIndividualTherapists = createAsyncThunk<
{ sortedIndividualTherapists: Therapist[]; currentPagesIndividual: number; totalPagesIndividual: number },
{ sortOption: string; page: number; limit: number },
{ rejectValue: string }
>(
    "therapist/fetchSortedIndividualTherapists",
    async ({sortOption, page, limit}, { rejectWithValue }) => {
        try {
            const response = await axios.get(SORTINDIVIDUALTHERAPIST, { params: { sortBy: sortOption, page, limit } });

            const { sortedIndividualTherapists, currentPagesIndividual, totalPagesIndividual } = response.data.data.data;
            return { sortedIndividualTherapists, currentPagesIndividual, totalPagesIndividual };
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch sorted individual therapists");
        }
    }
);


export const fetchSortedCoupleTherapists = createAsyncThunk<
{ sortedCoupleTherapists: Therapist[]; currentPagesCouple: number; totalPagesCouple: number },
{ sortOption: string; page: number; limit: number },
{ rejectValue: string }
>(
    "therapist/fetchSortedCoupleTherapists",
    async ({sortOption, page, limit}, { rejectWithValue }) => {
        try {
            const response = await axios.get(SORTCOUPLETHERAPIST, { params: { sortBy: sortOption, page, limit } });

            const { sortedCoupleTherapists, currentPagesCouple, totalPagesCouple } = response.data.data.data;
            return { sortedCoupleTherapists, currentPagesCouple, totalPagesCouple };
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch sorted couple therapists");
        }
    }
);



export const changePassword = createAsyncThunk<string, ChangePasswordPayload, { rejectValue: string }>(
    'user/changePassword',
    async (passwordDetails, thunkAPI) => {
        try {
            const response = await axios.put(CHANGEPASSWORD, passwordDetails);

            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to change password";
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const joinSession = createAsyncThunk(
    "session/joinSession",
    async ({ bookingId, role, userId}: { bookingId: string; role: string, userId: string}, thunkAPI ) => {
        try {
            const authInfoString = localStorage.getItem("authInfo");

            if (!authInfoString) {
                return thunkAPI.rejectWithValue("Token is missing or invalid");
            }

            const authInfo = JSON.parse(authInfoString);
            const accessToken = authInfo.accessToken;

            if (!accessToken) {
                return thunkAPI.rejectWithValue("Access token is missing or invalid");
            }

            const config = {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }

            const response = await axios.post(JOINSESSION, { bookingId, role, userId }, config);


            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to join session");
        }
    }
)


export const cancelAppointment = createAsyncThunk(
    "user/cancelAppointment",
    async ({ bookingId, userId }: { bookingId: string; userId: string }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(CANCELAPPOINTMENT, { bookingId, userId})

            return response;
            
        } catch (error:any) {
            return rejectWithValue(error.response?.data?.message || "Failed to cancel appointment");
        }
    }
)


export const submitIssue = createAsyncThunk<string, submitIssuePayload, {rejectValue: string}> (
    'user/submitIssue',
    async (issueDetails, thunkAPI) => {
        try {
            const response = await axios.post(SUBMITISSUE, issueDetails);

            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to submit issue";
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const geminiAPIResponse = createAsyncThunk<string, string, { rejectValue: string }>(
    'user/geminiAPIResponse',
    async (searchText, thunkAPI) => {
      try {
       
        const response = await axios.post(GEMINIAPI, { query: searchText });
  
        return response.data.data; 
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to fetch response from Gemini API';
        return thunkAPI.rejectWithValue(message);
      }
    }
  );



  


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
        },
        resetResult: (state) => {
            state.search_Result = null;
        },
        updateAvailableSlots: (state, action) => {
            state.availableSlots = action.payload;
        },
        clearSearchResults: (state) => {
            state.therapists = [];
            state.status = 'idle';
        },
        clearGeminiResults: (state) => {
            state.search_Result = "";
            state.status = 'idle';
        },
        clearChildTherapistSearchResults: (state) => {
            state.childTherapistsSearch = [];
            state.status = 'idle';
        },
        clearFamilyTherapistSearchResults: (state) => {
            state.familyTherapistsSearch = [];
            state.status = 'idle';
        },
        clearIndividualTherapistSearchResults: (state) => {
            state.individualTherapistsSearch = [];
            state.status = 'idle';
        },
        clearCoupleTherapistSearchResults: (state) => {
            state.coupleTherapistsSearch = [];
            state.status = 'idle';
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
            .addCase(fetchChildTherapist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.therapists = action.payload.therapists;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
              
            })
            .addCase(fetchChildTherapist.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || "Failed to fetch therapists";
            })
            .addCase(fetchFamilyTherapist.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchFamilyTherapist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.familyTherapists = action.payload.familyTherapist;
                state.totalPagesFamily = action.payload.totalPagesFamily;
                state.currentPagesFamily = action.payload.currentPagesFamily;
              
            })
            .addCase(fetchFamilyTherapist.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || "Failed to fetch therapists";
            })
            .addCase(fetchIndividualTherapist.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchIndividualTherapist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.individualTherapists = action.payload.individualTherapists;
                state.totalPagesIndividual = action.payload.totalPagesIndividual;
                state.currentPagesIndividual = action.payload.currentPagesIndividual;
              
            })
            .addCase(fetchIndividualTherapist.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || "Failed to fetch therapists";
            })
            .addCase(fetchCoupleTherapist.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCoupleTherapist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.coupleTherapists = action.payload.coupleTherapists;
                state.currentPagesCouple = action.payload.currentPagesCouple;
                state.totalPagesCouple = action.payload.totalPagesCouple;
              
            })
            .addCase(fetchCoupleTherapist.rejected, (state, action: PayloadAction<string | undefined>) => {
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
                state.booked = action.payload.booked;
                state.issues = action.payload.issues;
               
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
            .addCase(walletPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.appointmentData = action.payload.appointmentData;
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
            })
            .addCase(fetchSortedChildTherapists.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSortedChildTherapists.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sortedTherapists = action.payload.sortedTherapists
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage; 
            })
            .addCase(fetchSortedChildTherapists.rejected, (state, action) => {
                state.status = 'failed';
               
            })
            .addCase(fetchSortedFamilyTherapists.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSortedFamilyTherapists.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log("action paylod in sort famiy:", action.payload)
                state.sortedFamilyTherapists = action.payload.sortedFamilyTherapists;
                state.totalPagesFamily = action.payload.totalPagesFamily;
                state.currentPagesFamily = action.payload.currentPageFamily; 
            })
            .addCase(fetchSortedFamilyTherapists.rejected, (state, action) => {
                state.status = 'failed';
               
            })
            .addCase(fetchSortedIndividualTherapists.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSortedIndividualTherapists.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sortedIndividualTherapists = action.payload.sortedIndividualTherapists; 
                state.totalPagesIndividual = action.payload.totalPagesIndividual;
                state.currentPagesIndividual = action.payload.currentPagesIndividual
            })
            .addCase(fetchSortedIndividualTherapists.rejected, (state, action) => {
                state.status = 'failed';
            })
            .addCase(fetchSortedCoupleTherapists.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSortedCoupleTherapists.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sortedCoupleTherapists = action.payload.sortedCoupleTherapists; 
                state.totalPagesCouple = action.payload.totalPagesCouple;
                state.currentPagesCouple = action.payload.currentPagesCouple
            })
            .addCase(fetchSortedCoupleTherapists.rejected, (state, action) => {
                state.status = 'failed';
            })
            .addCase(fetchChildTherapistBySearchTerm.fulfilled, (state, action) => {
                state.childTherapistsSearch = action.payload; 
                state.status = 'succeeded';
            })
            .addCase(fetchChildTherapistBySearchTerm.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchChildTherapistBySearchTerm.rejected, (state, action) => {
                state.status = 'failed';
                state.error = null
            })
            .addCase(fetchFamilyTherapistBySearchTerm.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFamilyTherapistBySearchTerm.fulfilled, (state, action) => {
                state.familyTherapistsSearch = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchFamilyTherapistBySearchTerm.rejected, (state, action) => {
                state.status = "failed";
                state.error = null;
            })
            .addCase(fetchIndividualTherapistBySearchTerm.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchIndividualTherapistBySearchTerm.fulfilled, (state, action) => {
                state.individualTherapistsSearch = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchIndividualTherapistBySearchTerm.rejected, (state, action) => {
                state.status = "failed";
                state.error = null;
            })
            .addCase(fetchCoupleTherapistBySearchTerm.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCoupleTherapistBySearchTerm.fulfilled, (state, action) => {
                state.coupleTherapistsSearch = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCoupleTherapistBySearchTerm.rejected, (state) => {
                state.status = 'failed';
                state.error = null;
            })
            .addCase(geminiAPIResponse.pending, (state) => {
                state.loading = true;
                state.error = null; 
            })
            .addCase(geminiAPIResponse.fulfilled, (state, action) => {
                state.loading = false;
                state.search_Result = action.payload; 
            })
            .addCase(geminiAPIResponse.rejected, (state, action) => {
                state.loading = false;
            })  
            .addCase(fetchWalletDetails.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action payload:", action.payload);
                
                state.walletData = action.payload;
            })        
            
    }
})

export const { logoutUser, 
    clearError, 
    clearAppointmentStatus, 
    clearBookings, 
    resetSearchResults, 
    resetResult, 
    updateAvailableSlots, 
    clearSearchResults,
    clearGeminiResults,
    clearChildTherapistSearchResults,
    clearFamilyTherapistSearchResults,
    clearIndividualTherapistSearchResults,
    clearCoupleTherapistSearchResults } = userSlice.actions;

export default userSlice.reducer;