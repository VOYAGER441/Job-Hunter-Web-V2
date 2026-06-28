import { IResumeResponse, IResumeListResponse } from "@/interface/response/resume.response";
import { IResumeCreateRequest } from "@/interface/request/resume.request";
import axiosInstance from "./axiosInstance";
import { toast } from "sonner";

class ResumeService {
  async getResumes(): Promise<IResumeListResponse> {
    try {
      const response = await axiosInstance.get<IResumeListResponse>("/v2/resumes");
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch resumes");
      throw error;
    }
  }

  async getResume(id: string): Promise<IResumeResponse> {
    try {
      const response = await axiosInstance.get<IResumeResponse>(`/v2/resumes/get/${id}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch resume");
      throw error;
    }
  }

  async createResume(data: IResumeCreateRequest): Promise<IResumeResponse> {
    try {
      const response = await axiosInstance.post<IResumeResponse>("/v2/resumes/create", data);
      toast.success("Resume created successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to create resume");
      throw error;
    }
  }

  async updateResume(id: string, data: Partial<IResumeCreateRequest>): Promise<IResumeResponse> {
    try {
      const response = await axiosInstance.put<IResumeResponse>(`/v2/resumes/${id}`, data);
      toast.success("Resume updated successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to update resume");
      throw error;
    }
  }

  async deleteResume(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/v2/resumes/${id}`);
      toast.success("Resume deleted successfully");
    } catch (error) {
      toast.error("Failed to delete resume");
      throw error;
    }
  }
}

export default new ResumeService();