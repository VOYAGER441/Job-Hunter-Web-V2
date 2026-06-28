import { IProject, IEducation, IExperience } from "@/interface/request/resume.request";

export interface IResumeResponse {
  id: string;
  userId: string;
  name: string;
  phNumber: string;
  emailId: string;
  portfolioLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  summary?: string;
  skills?: string[];
  projectName: IProject[];
  education: IEducation[];
  experience: IExperience[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IResumeListResponse {
  resumes: IResumeResponse[];
  total: number;
}