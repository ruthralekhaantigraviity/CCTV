import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://cctv-kgck.onrender.com',
});

export default api;
