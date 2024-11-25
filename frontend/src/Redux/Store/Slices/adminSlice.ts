import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ADMINLOGIN, 
    GETTHERAPIST, 
    GETUSERS,
    GOTVERIFIED,
    GOTBLOCKUNBLOCK,
    GETTHERAPISTDETAILS,
    GETDASHBOARDDETAILS,
    FETCHISSUES,
    RESOLVEISSUE,
    ADMINNOTIFICATIONS
 } from "../../../Services/adminApi";
import { act } from "react";


interface Admin {
    id: string;
    name: string;
    email: string;
}

export interface Therapist {
    photo: any;
    gender: string;
    location: string;
    professionalExperience: string;
    identityProof: any;
    establishment: string;
    fees: string;
    counsellingQualification: string;
    educationalQualifications: string;
    _id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string
    isVerified: boolean;
    
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
    status: string;
    message: string;
    admin: Admin;
}

interface AdminState {
    admin: Admin | null;
    token: string | null;
    loading: boolean;
    isAdminAuthenticated: boolean;
    error: string | null;
    therapists: Therapist[];
    selectedTherapist: Therapist | null;
    users: User[];
    totalPages: number,
    currentPage: number,
    totalUsers: number,
    totalTherapists: number,
    totalAppointments: number,
    totalRevenue: number,
    issues: []
    blockStatus: User | null,
    adminNotifications: {
        pendingIssuesCount: number,
        pendingTherapistVerification : string[],
    },
    hasFetchedAdminNotifications: boolean,
    notificationsRead : boolean,
    }

const initialState: AdminState = {
    admin: null,
    token: localStorage.getItem('adminToken'),
    loading: false,
    isAdminAuthenticated: false,
    error:null,
    therapists: [],
    selectedTherapist: null,
    users: [],
    totalPages: 0,
    currentPage: 0,
    totalUsers: 0,
    totalTherapists: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    issues: [],
    blockStatus: null,
    adminNotifications: {
        pendingIssuesCount: 0,
        pendingTherapistVerification: [],
    },
    hasFetchedAdminNotifications: false,
    notificationsRead: false,
}

export const loginAdmin = createAsyncThunk<LoginResponse, {email: string, password: string }, { rejectValue: string }>(
    'admin/admin_login',
    async (adminData, thunkAPI) => {
        try {
            const response = await axios.post( ADMINLOGIN, adminData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            localStorage.setItem('adminToken', response.data.token);

            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.data || error.message || "An error occured";
            console.error("Login error:", error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchTherapists = createAsyncThunk<
    { therapists: Therapist[], totalPages: number, currentPage: number }, 
    { page: number, limit: number }, 
    { rejectValue: string }
>(
    "admin/fetchTherapists",
    async ({ page, limit }, thunkAPI) => {
        try {
            const response = await axios.get(`${GETTHERAPIST}?page=${page}&limit=${limit}`);
            return {
                therapists: response.data.data.therapists,
                totalPages: response.data.data.totalPages, 
                currentPage: response.data.data.currentPage 
            };
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch therapists";
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const fetchTherapistDetails = createAsyncThunk(
    "admin/fetchTherapistDetails",
    async (therapistId: string, thunkAPI) => {
       try {
        const response = await axios.get(`${GETTHERAPISTDETAILS}/${therapistId}`);
    
        return response.data.data
       } catch (error:any) {
         const message = error.response?.data?.message || "Failed to fetch details";
         return thunkAPI.rejectWithValue(message);
       }
    }
)

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


export const fetchIssues = createAsyncThunk("admin/fetchIssues",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(FETCHISSUES);
  
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch issues";
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const fetchDashboardDetails = createAsyncThunk("admin/dashboardDetails",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(GETDASHBOARDDETAILS);
            return response.data
            
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch dashboard details";
            return thunkAPI.rejectWithValue(message);
        }
    }
)


export const resolveIssue = createAsyncThunk(
    "admin/resolveIssue",
    async (issueId: string, thunkAPI) => {
        try {
            const response = await axios.post(RESOLVEISSUE, { issueId});

            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to resolve the issue";
            return thunkAPI.rejectWithValue(message);
        }
    }
)




export const getTherapistVerified = createAsyncThunk<Therapist[], string, {rejectValue: string}>(
    "admin/getTherapistVerified",
    async(therapistId, thunkAPI) => {
        try {
            const token = localStorage.getItem("adminToken");

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


export const toggleUserBlockStatus = createAsyncThunk<User, { userId: string; isBlocked: boolean }, { rejectValue: string }>(
    "admin/getBlockUnblock",
    async ({ userId, isBlocked }, thunkAPI) => {
      try {
       
        // Send isBlocked status along with the request
        const response = await axios.patch(`${GOTBLOCKUNBLOCK}/${userId}`, { isBlocked });

        return response.data.data.user;
      } catch (error) {
        console.error("Error in blocking/unblocking user:", error);
        return thunkAPI.rejectWithValue("Failed to toggle block status");
      }
    }
  );


  export const fetchAdminNotifications = createAsyncThunk(
    "admin/notifications",
    async (_, { rejectWithValue}) => {
        try {
            const response = await axios.get(ADMINNOTIFICATIONS);

            console.log("response from admin notification slice:", response.data.data);

            return response.data.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch the notifications")
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
            state.isAdminAuthenticated = false
            localStorage.removeItem('adminToken');
        },
        resetLoading: (state) => {
            state.loading = false;
            state.error = null;
        },
        setAdminNotificationsFetched: (state, action) => {
            state.hasFetchedAdminNotifications = action.payload
        },
        markAllAdminNotificationsAsRead: (state) => {
            state.notificationsRead = true;
        }
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
                state.isAdminAuthenticated = true;
                state.token = action.payload.token;
            })
            .addCase(loginAdmin.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.isAdminAuthenticated = false;
                state.error = action.payload || 'Login failed';
            })
            .addCase(fetchTherapists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTherapists.fulfilled, (state, action: PayloadAction<{ therapists: Therapist[], totalPages: number, currentPage: number }>) => {
                state.loading = false;
                console.log("Action payload:", action.payload);
            
                // Set the therapists data and pagination information
                state.therapists = action.payload.therapists; 
                state.totalPages = action.payload.totalPages;  
                state.currentPage = action.payload.currentPage;  
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
            .addCase(fetchTherapistDetails.pending, (state) => {
                state.loading = true;
                state.error = null;   
            })
            .addCase(fetchTherapistDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTherapist = action.payload
            })
            .addCase(fetchTherapistDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchDashboardDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardDetails.fulfilled, (state, action) => {
                state.loading = false;
                const { totalUsers, totalTherapists, totalAppointments, totalRevenue } =
                  action.payload.data; 
                state.totalUsers = totalUsers;
                state.totalTherapists = totalTherapists;
                state.totalAppointments = totalAppointments;
                state.totalRevenue = totalRevenue;
            })
            .addCase(fetchDashboardDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchIssues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIssues.fulfilled, (state, action) => {
                state.loading = false;
                state.issues = action.payload  
                state.error = null;
            })
            .addCase(fetchIssues.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(toggleUserBlockStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleUserBlockStatus.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false; 
                state.blockStatus = action.payload;
                
            })
            .addCase(toggleUserBlockStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to toggle block status";
            })
            .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.adminNotifications = {
                    pendingIssuesCount: action.payload.pendingIssuesCount || 0,
                    pendingTherapistVerification: action.payload.pendingTherapistVerification || [],
                }
                state.hasFetchedAdminNotifications = true;
            })
            
    },
});

export const { logout, resetLoading, markAllAdminNotificationsAsRead, setAdminNotificationsFetched } = adminSlice.actions;

export default adminSlice.reducer;