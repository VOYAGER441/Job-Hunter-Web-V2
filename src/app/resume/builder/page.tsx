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
import { useState, useEffect } from "react";
import { IUserResponse } from "@/interface/response/user.response";
import { IResumeResponse } from "@/interface/response/resume.response";
import userService from "@/service/user.service";
import resumeService from "@/service/resume.service";
import { FileTextIcon } from "lucide-react";
import { format } from "date-fns";

export default function ResumeBuilderPage() {
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [resumes, setResumes] = useState<IResumeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<IResumeResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userService.currentUser();
        setUser(userData);
        const resumeData = await resumeService.getResumeByUserId();
        setResumes(resumeData ? [resumeData] : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
                    <BreadcrumbPage>Resume Builder</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-12">
                <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No resumes found</h3>
                <p className="mt-2 text-muted-foreground">
                  Create your resume data first at Resume Data page
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-2">
                  <h2 className="font-semibold text-lg mb-2">Select Resume</h2>
                  {resumes.map((resume) => (
                    <button
                      key={resume.id}
                      type="button"
                      onClick={() => setSelectedResume(resume)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedResume?.id === resume.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-accent"
                      }`}
                    >
                      <div className="font-medium">{resume.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(resume.updatedAt), "MMM d, yyyy")}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="lg:col-span-2">
                  {selectedResume ? (
                    <div className="border rounded-lg p-6 space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold">{selectedResume.name}</h1>
                        <p className="text-sm text-muted-foreground">
                          {selectedResume.emailId} | {selectedResume.phNumber}
                        </p>
                        <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
                          {selectedResume.portfolioLink && <span>Portfolio</span>}
                          {selectedResume.linkedinLink && <span>LinkedIn</span>}
                          {selectedResume.githubLink && <span>GitHub</span>}
                        </div>
                      </div>
                      {selectedResume.summary && (
                        <div>
                          <h2 className="font-semibold mb-1">Summary</h2>
                          <p className="text-sm text-muted-foreground">{selectedResume.summary}</p>
                        </div>
                      )}
                      {selectedResume.skills && selectedResume.skills.length > 0 && (
                        <div>
                          <h2 className="font-semibold mb-2">Skills</h2>
                          <div className="flex flex-wrap gap-2">
                            {selectedResume.skills.map((skill) => (
                              <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedResume.experience.length > 0 && (
                        <div>
                          <h2 className="font-semibold mb-2">Experience</h2>
                          {selectedResume.experience.map((exp, i) => (
                            <div key={i} className="mb-3 pb-3 border-b last:border-0 last:pb-0">
                              <div className="font-medium">{exp.designation} at {exp.companyName}</div>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                                {exp.isCurrent ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : ""}
                              </div>
                              {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedResume.education.length > 0 && (
                        <div>
                          <h2 className="font-semibold mb-2">Education</h2>
                          {selectedResume.education.map((edu, i) => (
                            <div key={i} className="mb-2">
                              <div className="font-medium">{edu.degree} at {edu.instituteName}</div>
                              <div className="text-xs text-muted-foreground">
                                {edu.fieldOfStudy && `${edu.fieldOfStudy} · `}
                                {edu.grade && `Grade: ${edu.grade}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedResume.projectName.length > 0 && (
                        <div>
                          <h2 className="font-semibold mb-2">Projects</h2>
                          {selectedResume.projectName.map((proj: any, i: number) => (
                            <div key={i} className="mb-2">
                              <div className="font-medium">{proj.projectName}</div>
                              <p className="text-sm text-muted-foreground">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[300px] border rounded-lg text-muted-foreground">
                      Select a resume to preview
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}