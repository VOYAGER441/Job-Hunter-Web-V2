import { JOB_SOURCE } from "@/utils/constant";

export interface INormalizedJob {
  id: string; // cast Muse's number to string
  source: JOB_SOURCE;
  title: string;
  company: string;
  description: string; // HTML
  location: string;
  tags: string[];
  publishedAt: string; // ISO date
  applyUrl: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface IPaginatedJobsResponse {
  data: INormalizedJob[];
  total: number;
}