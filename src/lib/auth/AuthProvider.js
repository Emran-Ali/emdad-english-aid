'use client';
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import jwtAxios, {setAuthToken} from './index';

const JWTAuthContext = createContext({
    user: null,
    isAuthenticated: false,
    isLoading: true,
});

const JWTAuthActionsContext = createContext({
    signInUser: async () => Promise.resolve({success: false}),
    logout: async () => Promise.resolve(),
});

export const useJWTAuth = () => useContext(JWTAuthContext);
export const useJWTAuthActions = () => useContext(JWTAuthActionsContext);

const JWTAuthAuthProvider = ({
                                 children,
                             }) => {
    const [jWTAuthData, setJWTAuthData] = useState({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        const getAuthUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setJWTAuthData({
                    user: undefined,
                    isLoading: false,
                    isAuthenticated: false,
                });
                return;
            }
            setAuthToken(token);
            try {
                const {data} = await apiGet(API_USER_INFO);
                if (data.data?.permissions) {
                    Cookies.set('permissions', JSON.stringify(data.data.permissions));
                }
                setJWTAuthData({
                    user: data.data,
                    isLoading: false,
                    isAuthenticated: true,
                });
            } catch (err) {
                setJWTAuthData({
                    user: undefined,
                    isLoading: false,
                    isAuthenticated: false,
                });
            }
        };

        getAuthUser();
    }, []);

    const signInUser = async ({phone, password}) => {
        try {
            const {data} = await jwtAxios.post(API_LOGIN, {phone, password});
            localStorage.setItem('token', data.data?.access_token);
            setAuthToken(data.data?.access_token);
            await jwtAxios.get(API_USER_INFO);
            const res = await jwtAxios.get(API_USER_INFO);
            if (res.data.data?.permissions) {
                Cookies.set('permissions', JSON.stringify(res.data.data.permissions));
            }
            setJWTAuthData({
                user: res.data.data,
                isAuthenticated: true,
                isLoading: false,
            });
            return {success: true};
        } catch (error) {
            const errorResponse = error.response?.data?.errors || {
                phone: 'Phone number error',
                password: 'Password error',
            };
            return {
                success: false,
                errors: errorResponse,
                message: error.response?.data?.message,
            };
        }
    };

    const logout = async () => {
        localStorage.removeItem('token');
        Cookies.remove('permissions');
        setAuthToken();
        setJWTAuthData({
            user: null,
            isLoading: false,
            isAuthenticated: false,
        });
    };

    return (
        <JWTAuthContext.Provider
            value={{
                ...jWTAuthData,
            }}>
            <JWTAuthActionsContext.Provider
                value={{
                    signInUser,
                    logout,
                }}>
                {children}
            </JWTAuthActionsContext.Provider>
        </JWTAuthContext.Provider>
    );
};

export default JWTAuthAuthProvider;