import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { REGISTERTHERAPIST, VERIFYOTP, LOGINTHERAPIST, UPDATETHERAPIST, GETPROFILE  } from "../../../Services/therapistApi";

interface Timing {
    dayOfWeek: number,
    startTime: string,
    endTime: string
}

//Interfaces for state and Responses
export interface Therapist {
    _id: string;
    therapistId: string,
    name: string,
    email: string,
    phone?: string;
    specialization?: string;
    gender?: string;
    educationalQualifications?: string;
    identityProof?: string;
    counsellingQualification?: string;
    professionalExperience?: string;
    establishment?: string;
    location?: string;
    timings?: Timing[];
    fees?: number;
    photo?: string;
}

export  interface TherapistUpdation {
    therapistId:string,
    name: string;
    phone: string;
    specialization: string;
    gender: string;
    educationalQualifications: string;
    identityProof: string;
    counsellingQualification: string;
    professionalExperience: string;
    establishment: string;
    location: string;
    timings: Timing[];
    fees: number;
    photo?: string;
}

interface RegisterResponse {
    therapist: Therapist;
    token: string;
}

interface LoginResponse {
    token: string;
    therapist: Therapist;
}

interface TherapistState {
    therapists: Therapist[];
    currentTherapist:Therapist | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    otpVerified: boolean;
    otpError: string | null;
}

//initial state
const initialState: TherapistState = {
    therapists: [],
    currentTherapist: null,
    token: localStorage.getItem('therapistToken'),
    loading: false,
    error: null,
    otpVerified: false,
    otpError: null,
}

// Thunk for therapist login
export const registerTherapist = createAsyncThunk<RegisterResponse, {name: string, email: string, password: string}, { rejectValue: string}>(
    'therapist/therapist_register',
    async (therapistData, thunkAPI) => {
        console.log("entered registerTherapist slice");
        try {
            const response = await axios.post(REGISTERTHERAPIST, therapistData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("response from registerTherapist slice:", response);

            // Save the token to local storage
            localStorage.setItem('therapistToken', response.data.token);

            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.data || "An error occurred";
            return thunkAPI.rejectWithValue(message);
        }
    }
);


//Async thunk for OTP verification
export const verifyOtp = createAsyncThunk<{status: boolean}, string, {rejectValue: string}>(
    'therapist/therapist_OTP',
    async (otp, thunkAPI) => {
        console.log("entered verify otp in therapist slice:")
        try {
            const token = localStorage.getItem('therapistToken');
            if (!token) {
                return thunkAPI.rejectWithValue('No token found');
            }
            console.log('token from slice:', token);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(VERIFYOTP, { otp }, config);
            console.log("response from slice:", response);

            if (response.data.status) {
                localStorage.removeItem('therapistToken');
                return response.data;
            } else {
                return thunkAPI.rejectWithValue(response.data.message);
            }

        } catch (error) {
            return thunkAPI.rejectWithValue('Error verifying otp');
        }
    }
)


export const logintherapist = createAsyncThunk<LoginResponse, { email: string, password: string},{rejectValue: string}>(
    'therapist/therapist_login',
    async (therapistData, thunkAPI) => {
        try {
            const response = await axios.post(LOGINTHERAPIST, therapistData);

            const { token, therapist } = response.data;
            console.log("Token received from logintherapist slice:", token, therapist);

            // Decode the payload from the JWT token manually
            const base64Url = token.split('.')[1];

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);
            console.log("Decoded token:", decoded);

            localStorage.setItem('therapistToken', token);
            localStorage.setItem('therapist', JSON.stringify(decoded));
            localStorage.setItem("therapistId", therapist.therapistId);
            return { token, therapist: decoded };
        } catch (error:any) {
            const message = error.response?.data?.message || "Login failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// updating therapist details
export const updateTherapistDetails = createAsyncThunk<Therapist, FormData, {rejectValue:string}>(
    "therapist/updateTherapistDetails",
    async (formData, thunkAPI) => {
        try {
            const token = localStorage.getItem("therapistToken");
            console.log("token from updateTherapist:", token);
            if(!token) {
                return thunkAPI.rejectWithValue("No token found");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
            const response = await axios.put(UPDATETHERAPIST, formData, config);
            console.log("response from therapist slice:", response);

            console.log("Response from updateTherapistDetails thunk:", response.data);

            console.log("response from therapisr slice data:", response.data.data);
            return response.data.data;
        } catch (error:any) {
            const message = error.response?.data?.message || "update failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const fetchProfile = createAsyncThunk<Therapist[], void, {rejectValue: string}>(
    "therapist/fetchProfile",
    async(_, thunkAPI) => {
        try {
            const response = await axios.get(GETPROFILE);
            console.log("response from  fetch profile slice:", response);
            return response.data.data.therapist || [];
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch profile";
            return thunkAPI.rejectWithValue(message);
        }
    }
) 



const therapistSlice = createSlice({
    name: 'therapist',
    initialState,
    reducers: {
        logout: (state) => {
            state.currentTherapist = null;
            state.token = null;
            localStorage.removeItem('therapistToken');
            localStorage.removeItem('therapist');
        },
        clearError: (state) => {
            state.error = null;
            state.otpError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerTherapist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerTherapist.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
                state.loading = false;
                state.therapists = [action.payload.therapist];
                state.token = action.payload.token;
            })
            .addCase(registerTherapist.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            })
            .addCase(verifyOtp.pending, (state) => {
                state.otpVerified = false;
                state.otpError = null;
            })
            .addCase(verifyOtp.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.otpVerified = false;
                state.otpError = action.payload || "OTP verification failed"
            })
            .addCase(logintherapist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logintherapist.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.loading = false;
                state.currentTherapist = action.payload.therapist;
                state.token = action.payload.token;
            })
            .addCase(logintherapist.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })
            .addCase(updateTherapistDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTherapistDetails.fulfilled,(state, action: PayloadAction<Therapist>) => {
                  state.loading = false;
                  state.currentTherapist = {
                    ...state.currentTherapist,
                    ...action.payload,
                  }
            })
            .addCase(updateTherapistDetails.rejected,(state, action: PayloadAction<string | undefined>) => {
                  state.loading = false;
                  state.error = action.payload || "Update failed";
            })
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Therapist[]>) => {
                state.loading = false;
                const therapistId = localStorage.getItem("therapistId");
                console.log("id from slice:", therapistId);
                console.log("actionm playload slice:", action.payload)
                if (therapistId) {
                    state.currentTherapist = action.payload.find(t => t._id === therapistId) || null;
                }
            })
            .addCase(fetchProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Fetch profile failed";
            });
    },
}); 

export const { logout, clearError  } = therapistSlice.actions;



export default therapistSlice.reducer;
