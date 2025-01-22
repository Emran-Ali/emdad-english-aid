import axios from "./axiosConfig";

export function apiGet(url, config) {
    return axios.get(url, config);
}

export function apiPost(url, data, config) {
    return axios.post(url, data, config);
}

export function apiPut(url, data, config) {
    return axios.put(url, data, config);
}

export function apiPatch(url, data, config) {
    return axios.patch(url, data, config);
}

export function apiDelete(url, config) {
    return axios.delete(url, config);
}

export default axios;