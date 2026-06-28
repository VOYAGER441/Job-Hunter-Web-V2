"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AuthGuard from "@/components/AuthGuard";
import { useState, useEffect, useCallback } from "react";
import { IUserResponse } from "@/interface/response/user.response";
import { IResumeCreateRequest } from "@/interface/request/resume.request";
import userService from "@/service/user.service";
import resumeService from "@/service/resume.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Trash2Icon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface FormProject {
  projectName: string;
  description?: string;
  techStack?: string[];
  projectLink?: string;
  githubLink?: string;
  startDate?: string;
  endDate?: string;
}

interface FormEducation {
  instituteName: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
}

interface FormExperience {
  companyName: string;
  designation: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  techStack?: string[];
}

interface FormData {
  name: string;
  phNumber: string;
  emailId: string;
  portfolioLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  summary?: string;
  skills?: string[];
  projects: FormProject[];
  education: FormEducation[];
  experience: FormExperience[];
}

const emptyProject: FormProject = {
  projectName: "",
  description: "",
  techStack: [],
  projectLink: "",
  githubLink: "",
  startDate: "",
  endDate: "",
};

const emptyEducation: FormEducation = {
  instituteName: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  grade: "",
};

const emptyExperience: FormExperience = {
  companyName: "",
  designation: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  techStack: [],
};

function toDateOrUndefined(val: string | undefined): Date | undefined {
  return val ? new Date(val) : undefined;
}

export default function ResumeDataPage() {
  const router = useRouter();
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    projects: false,
    education: false,
    experience: false,
  });

  const [form, setForm] = useState<FormData>({
    name: "",
    phNumber: "",
    emailId: "",
    portfolioLink: "",
    linkedinLink: "",
    githubLink: "",
    summary: "",
    skills: [],
    projects: [],
    education: [],
    experience: [],
  });

  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    userService.currentUser().then(setUser).catch(console.error);
  }, []);

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const addProject = () => {
    setForm((prev) => ({ ...prev, projects: [...prev.projects, { ...emptyProject }] }));
  };

  const updateProject = (index: number, field: keyof FormProject, value: string | string[]) => {
    setForm((prev) => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], [field]: value };
      return { ...prev, projects };
    });
  };

  const removeProject = (index: number) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setForm((prev) => ({ ...prev, education: [...prev.education, { ...emptyEducation }] }));
  };

  const updateEducation = (index: number, field: keyof FormEducation, value: string) => {
    setForm((prev) => {
      const education = [...prev.education];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education };
    });
  };

  const removeEducation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    setForm((prev) => ({ ...prev, experience: [...prev.experience, { ...emptyExperience }] }));
  };

  const updateExperience = (index: number, field: keyof FormExperience, value: string | boolean | string[]) => {
    setForm((prev) => {
      const experience = [...prev.experience];
      experience[index] = { ...experience[index], [field]: value };
      return { ...prev, experience };
    });
  };

  const removeExperience = (index: number) => {
    setForm((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = () => {
    const trimmed = skillsInput.trim();
    if (trimmed && !form.skills?.includes(trimmed)) {
      setForm((prev) => ({ ...prev, skills: [...(prev.skills || []), trimmed] }));
      setSkillsInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setForm((prev) => ({ ...prev, skills: prev.skills?.filter((s) => s !== skill) }));
  };

  const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const payload: IResumeCreateRequest = {
        userId: user.id,
        name: form.name,
        phNumber: form.phNumber,
        emailId: form.emailId,
        portfolioLink: form.portfolioLink,
        linkedinLink: form.linkedinLink,
        githubLink: form.githubLink,
        summary: form.summary,
        skills: form.skills,
        projectName: form.projects.map((p) => ({
          projectName: p.projectName,
          description: p.description,
          techStack: p.techStack,
          projectLink: p.projectLink,
          githubLink: p.githubLink,
          startDate: toDateOrUndefined(p.startDate),
          endDate: toDateOrUndefined(p.endDate),
        })),
        education: form.education.map((e) => ({
          instituteName: e.instituteName,
          degree: e.degree,
          fieldOfStudy: e.fieldOfStudy,
          startDate: toDateOrUndefined(e.startDate),
          endDate: toDateOrUndefined(e.endDate),
          grade: e.grade,
        })),
        experience: form.experience.map((e) => ({
          companyName: e.companyName,
          designation: e.designation,
          startDate: e.startDate ? new Date(e.startDate) : new Date(),
          endDate: toDateOrUndefined(e.endDate),
          isCurrent: e.isCurrent,
          description: e.description,
          techStack: e.techStack,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await resumeService.createResume(payload);
      // router.push("/resume/builder");
    } catch (error) {
      console.error("Error creating resume:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const SectionToggle = ({ label, section }: { label: string; section: keyof typeof expandedSections }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-3 bg-muted rounded-lg mb-2 hover:bg-muted/80 transition-colors"
    >
      <span className="font-semibold text-lg">{label}</span>
      {expandedSections[section] ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
    </button>
  );

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar userData={user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4 self-center" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Job Hunter</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Resume Data</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0  mx-auto w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <SectionToggle label="Basic Information" section="basic" />
              {expandedSections.basic && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name *</label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number *</label>
                      <Input
                        required
                        value={form.phNumber}
                        onChange={(e) => updateField("phNumber", e.target.value)}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email *</label>
                      <Input
                        required
                        type="email"
                        value={form.emailId}
                        onChange={(e) => updateField("emailId", e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Portfolio Link</label>
                      <Input
                        value={form.portfolioLink || ""}
                        onChange={(e) => updateField("portfolioLink", e.target.value)}
                        placeholder="https://portfolio.dev"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">LinkedIn</label>
                      <Input
                        value={form.linkedinLink || ""}
                        onChange={(e) => updateField("linkedinLink", e.target.value)}
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">GitHub</label>
                      <Input
                        value={form.githubLink || ""}
                        onChange={(e) => updateField("githubLink", e.target.value)}
                        placeholder="https://github.com/johndoe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Summary</label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={form.summary || ""}
                      onChange={(e) => updateField("summary", e.target.value)}
                      placeholder="Brief professional summary..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Skills</label>
                    <div className="flex gap-2">
                      <Input
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        onKeyDown={handleSkillsKeyDown}
                        placeholder="Type a skill and press Enter"
                      />
                      <Button type="button" variant="outline" onClick={handleAddSkill}>Add</Button>
                    </div>
                    {form.skills && form.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {skill}
                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-destructive">
                              <Trash2Icon className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <SectionToggle label="Projects" section="projects" />
              {expandedSections.projects && (
                <div className="space-y-4 p-4 border rounded-lg">
                  {form.projects.map((project, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Project Name *</label>
                          <Input
                            required
                            value={project.projectName}
                            onChange={(e) => updateProject(index, "projectName", e.target.value)}
                            placeholder="Project name"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Tech Stack (comma separated)</label>
                          <Input
                            value={project.techStack?.join(", ") || ""}
                            onChange={(e) => updateProject(index, "techStack", e.target.value.split(",").map((s) => s.trim()))}
                            placeholder="React, Node.js, PostgreSQL"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Project Link</label>
                          <Input
                            value={project.projectLink || ""}
                            onChange={(e) => updateProject(index, "projectLink", e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">GitHub Link</label>
                          <Input
                            value={project.githubLink || ""}
                            onChange={(e) => updateProject(index, "githubLink", e.target.value)}
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Start Date</label>
                          <Input
                            type="date"
                            value={project.startDate || ""}
                            onChange={(e) => updateProject(index, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">End Date</label>
                          <Input
                            type="date"
                            value={project.endDate || ""}
                            onChange={(e) => updateProject(index, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Description</label>
                        <textarea
                          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={project.description || ""}
                          onChange={(e) => updateProject(index, "description", e.target.value)}
                          placeholder="Project description..."
                        />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addProject} className="w-full">
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                </div>
              )}

              <SectionToggle label="Education" section="education" />
              {expandedSections.education && (
                <div className="space-y-4 p-4 border rounded-lg">
                  {form.education.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Institute *</label>
                          <Input
                            required
                            value={edu.instituteName}
                            onChange={(e) => updateEducation(index, "instituteName", e.target.value)}
                            placeholder="University name"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Degree *</label>
                          <Input
                            required
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            placeholder="B.Tech, M.Sc, etc."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Field of Study</label>
                          <Input
                            value={edu.fieldOfStudy || ""}
                            onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)}
                            placeholder="Computer Science"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Grade</label>
                          <Input
                            value={edu.grade || ""}
                            onChange={(e) => updateEducation(index, "grade", e.target.value)}
                            placeholder="GPA / Percentage"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Start Date</label>
                          <Input
                            type="date"
                            value={edu.startDate || ""}
                            onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">End Date</label>
                          <Input
                            type="date"
                            value={edu.endDate || ""}
                            onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addEducation} className="w-full">
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Education
                  </Button>
                </div>
              )}

              <SectionToggle label="Experience" section="experience" />
              {expandedSections.experience && (
                <div className="space-y-4 p-4 border rounded-lg">
                  {form.experience.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Company *</label>
                          <Input
                            required
                            value={exp.companyName}
                            onChange={(e) => updateExperience(index, "companyName", e.target.value)}
                            placeholder="Company name"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Designation *</label>
                          <Input
                            required
                            value={exp.designation}
                            onChange={(e) => updateExperience(index, "designation", e.target.value)}
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Start Date</label>
                          <Input
                            type="date"
                            required
                            value={exp.startDate || ""}
                            onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">End Date</label>
                          <Input
                            type="date"
                            value={exp.endDate || ""}
                            onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                            disabled={exp.isCurrent}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Tech Stack (comma separated)</label>
                          <Input
                            value={exp.techStack?.join(", ") || ""}
                            onChange={(e) => updateExperience(index, "techStack", e.target.value.split(",").map((s) => s.trim()))}
                            placeholder="React, Node.js"
                          />
                        </div>
                        <div className="flex items-end pb-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={exp.isCurrent || false}
                              onChange={(e) => updateExperience(index, "isCurrent", e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <span className="text-sm">Currently working here</span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Description</label>
                        <textarea
                          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={exp.description || ""}
                          onChange={(e) => updateExperience(index, "description", e.target.value)}
                          placeholder="Job description..."
                        />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addExperience} className="w-full">
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Experience
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-4 pb-8">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Resume"}
                </Button>
              </div>
            </form>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}