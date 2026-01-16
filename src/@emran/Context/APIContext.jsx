// contexts/ApiContext.js
'use client';
import { createContext, useContext, useState } from 'react';
import {apiGet, apiPost, apiPut, apiDelete } from "@emran/lib/axios";

const ApiContext = createContext();

export function ApiProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRequest = async (apiCall) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiCall();
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const post = async (url, data, config) => {
        console.log('Hello From Post')
        return handleRequest(() => apiPost(url, data, config));
    };

    const get = async (url, config) => {
        return handleRequest(() => apiGet(url, config));
    };

    const put = async (url, data, config) => {
        return handleRequest(() => apiPut(url, data, config));
    };

    const del = async (url, config) => {
        return handleRequest(() => apiDelete(url, config));
    };

    const value = {
        loading,
        error,
        post,
        get,
        put,
        delete: del
    };

    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};