import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

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
    console.log('Setting auth info');
    authInfo = { accessToken: token, role: role };
    localStorage.setItem('authInfo', JSON.stringify(authInfo));
    localStorage.setItem('refreshToken', refreshToken);
};

// Function to clear auth info
export const clearAuthInfo = () => {
    console.log('Clearing auth info');
    authInfo = { accessToken: null, role: null };
    localStorage.removeItem('authInfo');
    localStorage.removeItem('refreshToken');
};

// Load stored auth info
const storedAuthInfo = localStorage.getItem('authInfo');
if (storedAuthInfo) {
    console.log('Found stored auth info');
    authInfo = JSON.parse(storedAuthInfo);
} else {
    console.log('No stored auth info found');
}

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// // Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Request interceptor executed.............');
        const accessToken = localStorage.getItem('newToken');
        console.log("access token :", accessToken);

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
        console.log('Response interceptor executed : Error');
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Access token expired, trying to refresh token....');
            originalRequest._retry = true;

            try {
                console.log("inteceptors.....")
                const refreshResponse = await axios.post(
                    "http://localhost:8080/refresh_token",
                    {},
                    { withCredentials: true }
                );
                console.log('Refresh token response:', refreshResponse.data);

                const newAccessToken = refreshResponse.data.accessToken;

                if (newAccessToken) {
                    console.log('Received new access token');
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
