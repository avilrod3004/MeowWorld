import axios from 'axios';
import { useAuthStore } from "../stores/authStore.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
});

// Interceptor para incluir el token en cada petición
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    // const token = useAuthStore().getToken.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    } else {
        config.headers['Content-Type'] = 'application/json';
    }

    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
    return Promise.reject(error);
});

export default api;
