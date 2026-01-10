import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') // hoặc firebase auth
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})