// axiosInstance.ts
import axios from "axios";
import * as env from "@/env";
import authService from "./auth.service";

const axiosInstance = axios.create({
    baseURL: env.NEXT_PUBLIC_BACKEND_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isLoggingOut = false;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !isLoggingOut) {
            isLoggingOut = true;
            await authService.logout();
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;