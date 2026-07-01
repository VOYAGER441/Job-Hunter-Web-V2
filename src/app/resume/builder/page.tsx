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
import { IResumeResponse } from "@/interface/response/resume.response";
import userService from "@/service/user.service";
import resumeService from "@/service/resume.service";
import { FileTextIcon } from "lucide-react";
import { format } from "date-fns";
import { Document, Page } from 'react-pdf';

// ── Preview Modal ─────────────────────────────────────────────────────────────

function ResumePreviewModal({
  initialHtml,
  onSave,
  onCancel,
}: {
  initialHtml: string;
  onSave: (html: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [html, setHtml] = useState(initialHtml);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(html);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b shrink-0">
        <div>
          <h2 className="text-lg font-semibold">Resume Preview</h2>
          <p className="text-xs text-muted-foreground">
            Review your resume or edit the HTML source directly
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-accent transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save & Generate PDF"}
          </button>
        </div>
      </header>

      {/* Split pane — editor left, preview right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — HTML source editor */}
        <div className="w-1/2 border-r flex flex-col overflow-hidden">
          <div className="text-xs font-medium text-muted-foreground px-4 py-2 border-b bg-muted/20 shrink-0">
            HTML Source
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="flex-1 p-4 font-mono text-xs leading-relaxed border-0 resize-none focus:outline-none bg-muted/30"
            spellCheck={false}
          />
        </div>

        {/* Right — live preview */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="text-xs font-medium text-muted-foreground px-4 py-2 border-b bg-muted/20 shrink-0">
            Live Preview
          </div>
          <div className="flex-1 bg-gray-50 overflow-hidden">
            <iframe
              srcDoc={html}
              className="w-full h-full border-0"
              title="Resume Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ResumeBuilderPage() {
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [resumes, setResumes] = useState<IResumeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<IResumeResponse | null>(null);
  const [isEditingHtml, setIsEditingHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [buildingAI, setBuildingAI] = useState(false);

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

  useEffect(() => {
    if (!isEditingHtml) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isEditingHtml]);

  const handleBuildAI = async () => {
    if (!selectedResume) return;
    setBuildingAI(true);
    try {
      const html = await resumeService.buildWithAI(selectedResume.id);
      setHtmlContent(html);
      setIsEditingHtml(true);
    } catch (error) {
      console.error("AI build error:", error);
    } finally {
      setBuildingAI(false);
    }
  };

  const handleSaveHtml = useCallback(
    async (html: string) => {
      if (!selectedResume) return;
      await resumeService.updateResumeHtml(selectedResume.id, html);
      window.location.reload();
    },
    [selectedResume]
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
                {/* Resume list */}
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

                {/* Resume preview */}
                <div className="lg:col-span-2">
                  {selectedResume ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{selectedResume.name}</h1>
                        <button
                          onClick={handleBuildAI}
                          disabled={buildingAI}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-60 flex items-center gap-2"
                        >
                          {buildingAI && (
                            <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full inline-block" />
                          )}
                          {buildingAI ? "Building..." : "Build with AI"}
                        </button>
                      </div>

                      {selectedResume.publicUrl && selectedResume.fileKey ? (
                        <div className="border rounded-lg overflow-hidden h-[800px] bg-muted">
                          <iframe
                            src={selectedResume.publicUrl}
                            className="w-full h-full"
                            title="Resume PDF Preview"
                          />
                        </div>
                      ) : (
                        <div className="border rounded-lg p-6 space-y-2 bg-background text-sm text-muted-foreground">
                          <p>{selectedResume.emailId} | {selectedResume.phNumber}</p>
                          <p>Click "Build with AI" to generate your resume.</p>
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

      {/* Preview modal — passes AI HTML directly to backend */}
      {isEditingHtml && (
        <ResumePreviewModal
          key={htmlContent}
          initialHtml={htmlContent}
          onSave={handleSaveHtml}
          onCancel={() => setIsEditingHtml(false)}
        />
      )}
    </AuthGuard>
  );
}
