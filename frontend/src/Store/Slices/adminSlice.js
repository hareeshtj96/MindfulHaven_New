import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const loginAdmin = createAsyncThunk(
    'admin/admin_login',
    async (adminData, thunkAPI) => {
        console.log("entered loginAdminslice");
        try {
            const response = await axios.post('http://localhost:8080/admin/admin_login', adminData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("response from loginadminslice:", response);

            localStorage.setItem('adminToken', response.data.token);

            return response.data;
        } catch (error) {
            const message = error.response?.data?.data || "An error occured";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        admin: null,
        token: localStorage.getItem('adminToken') || null,
        loading: false,
        error: null,
    },
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
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload.admin;
                state.token = action.payload.token;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = adminSlice.actions;

export default adminSlice.reducer;