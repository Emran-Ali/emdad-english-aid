import appRoutes from '@softbd/constants/appRouteConstants';
import axios from 'axios';
import Cookies from 'js-cookie';
import {cookies} from "next/headers";

const apiConfig = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

apiConfig.interceptors.request.use(
    (config) => {
        const token = cookies.get('authToken');
        const refreshToken = Cookies.get('refreshToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor for API calls
apiConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        if (error?.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = appRoutes.signin.path;
        }
        return Promise.reject(error);
    },
);

export default apiConfig;