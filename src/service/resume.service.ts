import { IResumeResponse, IResumeListResponse } from "@/interface/response/resume.response";
import { IResumeCreateRequest } from "@/interface/request/resume.request";
import axiosInstance from "./axiosInstance";
import { toast } from "sonner";

class ResumeService {
  async getResumeByUserId(): Promise<IResumeResponse | null> {
    try {
      const response = await axiosInstance.get("/v2/resumes/resumeByUser");
      return response.data ?? null;
    } catch (error) {
      toast.error("Failed to fetch resumes");
      throw error;
    }
  }

  async getResumeByResumeId(id: string): Promise<IResumeResponse> {
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

  async buildWithAI(id: string): Promise<string> {
    try {
      const response = await axiosInstance.post(`/v2/resumes/build`);
      return response.data;
    } catch (error) {
      toast.error("Failed to build resume with AI");
      throw error;
    }
  }

  async updateResumeHtml(id: string, html: string): Promise<IResumeResponse> {
    try {
      const response = await axiosInstance.put(`/v2/resumes/finalBuild`,
        {htmlData:html}
      );
      toast.success("Resume updated and PDF generated");
      return response.data;
    } catch (error) {
      toast.error("Failed to update resume HTML");
      throw error;
    }
  }
}

export default new ResumeService();