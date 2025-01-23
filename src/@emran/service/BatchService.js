// hooks/useDesignation.js
import { useCallback } from 'react';
import {useApi} from "@emran/Context/APIContext";

export function useBatchService() {
    const api = useApi();

    const getBatch = useCallback((url,data, config) => {
        return api.post(url, data, config);
    }, [api]);
    const createBatch = useCallback((url,data, config) => {
        return api.post(url, data, config);
    }, [api]);

    const updateBatch = useCallback((url, data, config) => {
        return api.put(url, data, config);
    }, [api]);

    const deleteBatch = useCallback((url, config) => {
        return api.delete(url, config);
    }, [api]);

    return {
        loading: api.loading,
        error: api.error,
        getBatch,
        createBatch,
        updateBatch,
        deleteBatch
    };
}