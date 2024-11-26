import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Define types
interface AuthInfo {
    accessToken: string | null;
    role: string | null;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Initialize authInfo
let authInfo: AuthInfo = {
    accessToken: null,
    role: null
};

// Function to set auth info
export const setAuthInfo = (token: string, role: string, refreshToken: string) => {

    authInfo = { accessToken: token, role: role };
    localStorage.setItem('authInfo', JSON.stringify(authInfo));
    localStorage.setItem('refreshToken', refreshToken);
};


// Function to clear auth info
export const clearAuthInfo = () => {
    authInfo = { accessToken: null, role: null };
    localStorage.removeItem('authInfo');
    localStorage.removeItem('refreshToken');
};

// Load stored auth info
const storedAuthInfo = localStorage.getItem('authInfo');
if (storedAuthInfo) {
    authInfo = JSON.parse(storedAuthInfo);
} else {
}

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// // Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const authInfoString = localStorage.getItem('authInfo');
        const authInfo = authInfoString ? JSON.parse(authInfoString) : null;
        const accessToken = authInfo ? authInfo.accessToken : null;
        const role = authInfo ? authInfo.role : null;

        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('Error in request interceptor:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response interceptor executed (success)');
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const authInfoString = localStorage.getItem('authInfo')
            if(!authInfoString) {
                console.error("no auth info found");
                clearAuthInfo()
                window.location.href = '/login';
                return Promise.reject(error);
            }

            const authInfo = JSON.parse(authInfoString);
            const role = authInfo.role;
            try {
                const refreshResponse = await axios.post(
                    `${BASE_URL}/refresh_token`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.accessToken;

                if (newAccessToken) {
                    authInfo.accessToken = newAccessToken;
                    localStorage.setItem('authInfo', JSON.stringify(authInfo));

                    if (originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    }

                    return axiosInstance(originalRequest);
                } else {
                    console.error('No new access token received');
                    clearAuthInfo();
                    window.location.href = '/login';
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                clearAuthInfo();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

console.log('Axios configuration complete');

export default axiosInstance;
