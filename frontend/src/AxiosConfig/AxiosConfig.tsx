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
    console.log('Setting function called');
    console.log("recieved token:", token);
    console.log('recieved role:', role);
    console.log("received refreshToken:", refreshToken);

    authInfo = { accessToken: token, role: role };
    console.log("auth info.......", authInfo);
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
console.log("stored auth info:", storedAuthInfo);
if (storedAuthInfo) {
    console.log('Found stored auth info');
    authInfo = JSON.parse(storedAuthInfo);
} else {
    console.log('No stored auth info found');
}

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// // Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Request interceptor executed.............');
        console.log('authInfo....')
        const authInfoString = localStorage.getItem('authInfo');
        const authInfo = authInfoString ? JSON.parse(authInfoString) : null;
        const accessToken = authInfo ? authInfo.accessToken : null;
        const role = authInfo ? authInfo.role : null;
        console.log("access token :", accessToken);

        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        console.log('cookies being sent:', document.cookie);
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
        console.log('Response interceptor executed:',error);
        const originalRequest = error.config as CustomAxiosRequestConfig;
        console.log("original request:", originalRequest);

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Access token expired, trying to refresh token....');
            originalRequest._retry = true;

            const authInfoString = localStorage.getItem('authInfo')
            console.log(" from axios config  authinfostring:", authInfoString);
            if(!authInfoString) {
                console.error("no auth info found");
                clearAuthInfo()
                window.location.href = '/login';
                return Promise.reject(error);
            }

            const authInfo = JSON.parse(authInfoString);
            const role = authInfo.role;
            console.log("from config....", authInfo);

            try {
                console.log("inteceptors.....")
                const refreshResponse = await axios.post(
                    "http://localhost:8080/refresh_token",
                    {},
                    { withCredentials: true }
                );
                console.log('Refresh token response:', refreshResponse.data);

                const newAccessToken = refreshResponse.data.accessToken;
                console.log("new access token:", newAccessToken);

                if (newAccessToken) {
                    console.log('Received new access token');
                    authInfo.accessToken = newAccessToken;
                    localStorage.setItem('authInfo', JSON.stringify(authInfo));

                    if (originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        console.log('Updated headers:', originalRequest.headers);
                    }

                    console.log("retrying original request with new token...")
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
