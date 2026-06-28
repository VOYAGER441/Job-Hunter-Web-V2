// axiosInstance.ts
import axios from "axios";
import * as env from "@/env";

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

export default axiosInstance;