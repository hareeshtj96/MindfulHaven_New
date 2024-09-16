import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ADMINLOGIN, 
    GETTHERAPIST, 
    GETUSERS,
    GOTVERIFIED
 } from "../../../Services/adminApi";


interface Admin {
    id: string;
    name: string;
    email: string;
}

interface Therapist {
    _id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string
    isVerified: boolean
}

interface User {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    isBlocked: boolean;
}

interface LoginResponse {
    token: string;
    admin: Admin;
}

interface AdminState {
    admin: Admin | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    therapists: Therapist[];
    users: User[];
}

const initialState: AdminState = {
    admin: null,
    token: localStorage.getItem('adminToken') || null,
    loading: false,
    error:null,
    therapists: [],
    users: [],
}

export const loginAdmin = createAsyncThunk<LoginResponse, {email: string, password: string }, { rejectValue: string }>(
    'admin/admin_login',
    async (adminData, thunkAPI) => {
        console.log("entered loginAdminslice");
        try {
            const response = await axios.post( ADMINLOGIN, adminData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("response from loginadminslice:", response);

            localStorage.setItem('adminToken', response.data.token);

            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.data || "An error occured";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchTherapists = createAsyncThunk<Therapist[], void, { rejectValue: string}>(
    "admin/fetchTherapists",
    async(_, thunkAPI) => {
        try {
            const response = await axios.get(GETTHERAPIST);
          
            return response.data.data.therapists;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch therapists";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchUsers = createAsyncThunk<User[], void, {rejectValue: string}>(
    "admin/fetchUsers",
    async(_, thunkAPI) => {
        try {
            const response = await axios.get(GETUSERS);

            return response.data.data.users;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch users";
            return thunkAPI.rejectWithValue(message);
        }
    }
)




export const getTherapistVerified = createAsyncThunk<Therapist[], string, {rejectValue: string}>(
    "admin/getTherapistVerified",
    async(therapistId, thunkAPI) => {
        try {
            const token = localStorage.getItem("adminToken");
            console.log("token recieved from verifed therapist:", token);
            if(!token) {
                return thunkAPI.rejectWithValue("No token found");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
            const response = await axios.patch(`${GOTVERIFIED}/${therapistId}`, {}, config);

            return response.data.therapist;
        } catch (error: any) {
            const message = error.response?.data?.message || "Verification failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
)

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        logout: (state) => {
            state.admin = null;
            state.token = null;
            localStorage.removeItem('adminToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.loading = false;
                state.admin = action.payload.admin;
                state.token = action.payload.token;
            })
            .addCase(loginAdmin.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            })
            .addCase(fetchTherapists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTherapists.fulfilled, (state, action: PayloadAction<Therapist[]>) => {
                state.loading = false;
                console.log("Action paylod:", action.payload);
                state.therapists = action.payload;
            })
            .addCase(fetchTherapists.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch therapists";
            })
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false;
                console.log("action payload user:", action.payload);
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action:PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch users";
            })
    },
});

export const { logout } = adminSlice.actions;

export default adminSlice.reducer;