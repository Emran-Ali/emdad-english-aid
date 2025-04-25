import axios from 'axios';
import Cookies from 'js-cookie';

const apiConfig = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

apiConfig.interceptors.request.use(
    (config) => {
        const token = Cookies.get('authToken');
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

apiConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        if (error?.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    },
);

export default apiConfig;