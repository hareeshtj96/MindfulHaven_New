import axios, { AxiosError } from 'axios';


const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

interface AuthInfo {
    accessToken: string | null;
    role: string | null;
}

let authInfo: AuthInfo = {
    accessToken: null,
    role: null
}

export const setAuthInfo = (token: string, role:string, refreshToken: string) => {
    authInfo = {accessToken: token, role: role};
    localStorage.setItem('authInfo', JSON.stringify(authInfo));
    localStorage.setItem('refreshToken', refreshToken);
}

export const clearAuthInfo = () => {
    authInfo = {accessToken:null, role:null};
    localStorage.removeItem('authInfo');
}

const storedAuthInfo = localStorage.getItem('authInfo');
if(storedAuthInfo) {
    authInfo = JSON.parse(storedAuthInfo);
}


axiosInstance.interceptors.request.use(
    (config) => {
        console.log("access token............", authInfo.accessToken);
        if(authInfo.accessToken) {
            config.headers['Authorization'] = `Bearer ${authInfo.accessToken}`;
            config.headers['Role'] = authInfo.role;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use (
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;
        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if(!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const {data} = await axios.post('/refresh_token', {token: refreshToken},
                    {baseURL: "http://localhost:8080/", withCredentials: true}
                );

                setAuthInfo(data.accessToken, data.role, data.refreshToken);

                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                originalRequest.headers['Role'] = data.role;

                return axiosInstance(originalRequest)
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                clearAuthInfo();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        } else if (error.response?.status === 401) {
            clearAuthInfo();
            window.location.href = '/401';
            setTimeout(() => {
                window.location.href = '/login'
            }, 10000)
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
)


export default axiosInstance;

