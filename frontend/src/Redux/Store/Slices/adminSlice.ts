import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ADMINLOGIN } from "../../../Services/adminApi";


interface Admin {
    id: string;
    name: string;
    email: string;
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
}

const initialState: AdminState = {
    admin: null,
    token: localStorage.getItem('adminToken') || null,
    loading: false,
    error:null
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
            });
    },
});

export const { logout } = adminSlice.actions;

export default adminSlice.reducer;