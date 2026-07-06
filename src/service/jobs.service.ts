import { INormalizedJob, IPaginatedJobsResponse } from "@/interface/response/job.response";
import axiosInstance from "./axiosInstance";
import { IJobSearchParams } from "@/interface/request/jobs.request";
import { toast } from "sonner";

class JobsService {
    async getAllJobs(): Promise<INormalizedJob[]> {
        try {
            const response = await axiosInstance.get('/v2/jobs');
            return response.data;
        } catch (error) {
            toast.error("Failed to fetch jobs");
            throw error;
        }
    }

    async searchJobs(params: IJobSearchParams): Promise<IPaginatedJobsResponse> {
        try {
            const query: Record<string, string | number> = {};
            if (params.keyword) query.keyword = params.keyword;
            if (params.category) query.category = params.category;
            if (params.location) query.location = params.location;
            if (params.company) query.company = params.company;
            if (params.level) query.level = params.level;
            if (params.tags) query.tags = params.tags;
            if (params.page) query.page = params.page;
            if (params.sort) query.sort = params.sort;
            const response = await axiosInstance.get('/v2/jobs', { params: query });
            const body = response.data;
            if (Array.isArray(body)) {
                return { data: body, total: body.length };
            }
            return {
                data: body?.data ?? [],
                total: body?.total ?? 0,
            };
        } catch (error) {
            toast.error("Failed to search jobs");
            throw error;
        }
    }
}

export default new JobsService();