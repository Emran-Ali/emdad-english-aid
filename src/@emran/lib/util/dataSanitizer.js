// utils/dataSanitizer.js
export const dataSanitizer = (data) => {
    if (!data) return data;

    if (Array.isArray(data)) {
        return data.map((item) => dataSanitizer(item));
    }

    if (typeof data === 'object' && data !== null) {
        const sanitized = {};
        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                sanitized[key] = dataSanitizer(data[key]);
            }
        }
        return sanitized;
    }

    return data;
};
