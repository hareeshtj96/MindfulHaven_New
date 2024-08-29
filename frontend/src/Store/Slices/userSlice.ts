import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


interface User {
    id: string;
    name: string;
    email: string;
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
    message: string;
}

interface UserState {
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    loading: boolean;
    otpVerified: boolean;
    otpError: string | null;
    isAuthenticated: boolean;
    loginError: string | null;
    forgotPasswordStatus : 'idle' | 'loading' | 'succeeded' | 'failed';
    forgotPasswordError: string | null;
    forgotPasswordSuccess: string | null;
}


const initialState: UserState = {
    user: null,
    token: localStorage.getItem('token'),
    status: 'idle',
    error: null,
    loading: false,
    otpVerified: false,
    otpError: null,
    isAuthenticated: false,
    loginError: null,
    forgotPasswordStatus: 'idle',
    forgotPasswordError: null,
    forgotPasswordSuccess: null,
}

export const registerUser = createAsyncThunk<RegisterResponse, {name: string, email: string, mobile:string, password: string}, {rejectValue: string}>(
    'user/registerUser',
    async (userData, thunkAPI) => {
        try {

            const response = await axios.post('http://localhost:8080/register', userData);

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
            const response = await axios.post('http://localhost:8080/register_google_auth', userData);


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
            const response = await axios.post('http://localhost:8080/verify_otp', { otp }, config);

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


export const loginUser = createAsyncThunk<LoginResponse, {email: string, password: string}, {rejectValue:string}>(
    'user/loginUser',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post('http://localhost:8080/login', userData);

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
export const forgotPassword = createAsyncThunk<ForgotPasswordResponse, any, {rejectValue:string}>(
    'user/forgotPassword',
    async (passwordData, thunkAPI) => {
        console.log("password data:", passwordData);
        try {
            const response = await axios.post('http://localhost:8080/forgot_password', passwordData);
            console.log("response from user slice:", response);
            return response.data;
        } catch (error:any) {
            const message = error.response?.data?.message || "An error occurred";
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
            });
    }
})

export const { logoutUser, clearError } = userSlice.actions;

export default userSlice.reducer;