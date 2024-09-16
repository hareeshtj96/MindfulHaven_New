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
    GETCHILDTHERAPIST
 } from "../../../Services/userApi";



interface User {
    id: string;
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
    id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    professionalExperience: number;
    photo: string;
}


interface PasswordResetPayload {
    newPassword: string;
    confirmPassword: string;
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


export const fetchUserProfile = createAsyncThunk<User[], void, {rejectValue: string}>(
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
            const response = await axios.get(GETUSERPROFILE, config);
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
            const response = await axios.get(GETCHILDTHERAPIST);
            console.log("Response from fetch child therapist slice:", response);
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch child therapists';
            return thunkAPI.rejectWithValue(message);
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
                state.therapists = action.payload; // Store the fetched therapists
            })
            .addCase(fetchChildTherapist.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || "Failed to fetch therapists";
            });
            
    }
})

export const { logoutUser, clearError } = userSlice.actions;

export default userSlice.reducer;