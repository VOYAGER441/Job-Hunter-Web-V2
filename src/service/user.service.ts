import { IUserResponse } from "@/interface/response/user.response";
import axios from "axios";
import { toast } from "sonner";
import * as env from "@/env";
import axiosInstance from "./axiosInstance";

class UserService {
    async currentUser() {
        try {
            const userData = await axiosInstance.get<IUserResponse>(`/v2/users/me`);
            return userData.data;
        } catch (error) {
            toast.error("Failed to fetch user data");
            throw error;
        }
    }
}

export default new UserService();