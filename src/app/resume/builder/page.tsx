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
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

// ── Toolbar ────────────────────────────────────────────────────────────────────

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("Enter URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/40">
      {/* Text style */}
      <ToolbarButton
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
      >
        <span className="underline">U</span>
      </ToolbarButton>

      <div className="w-px bg-border mx-1 self-stretch" />

      {/* Headings */}
      <ToolbarButton
        title="Heading 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        title="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        title="Normal text"
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive("paragraph")}
      >
        ¶
      </ToolbarButton>

      <div className="w-px bg-border mx-1 self-stretch" />

      {/* Lists */}
      <ToolbarButton
        title="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        1. List
      </ToolbarButton>

      <div className="w-px bg-border mx-1 self-stretch" />

      {/* Alignment */}
      <ToolbarButton
        title="Align left"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
      >
        ←
      </ToolbarButton>
      <ToolbarButton
        title="Align center"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
      >
        ≡
      </ToolbarButton>
      <ToolbarButton
        title="Align right"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
      >
        →
      </ToolbarButton>

      <div className="w-px bg-border mx-1 self-stretch" />

      {/* Link & HR */}
      <ToolbarButton title="Add link" onClick={setLink}>
        🔗
      </ToolbarButton>
      <ToolbarButton
        title="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        ─
      </ToolbarButton>

      <div className="w-px bg-border mx-1 self-stretch" />

      {/* History */}
      <ToolbarButton
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      >
        ↩
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
      >
        ↪
      </ToolbarButton>
    </div>
  );
}

// ── Live Preview ───────────────────────────────────────────────────────────────

function HtmlPreview({ html }: { html: string }) {
  // Use srcdoc so the iframe renders the full HTML with its own styles isolated
  const srcdoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;
  return (
    <iframe
      srcDoc={srcdoc}
      className="w-full h-full border-0"
      title="Resume Preview"
      sandbox="allow-same-origin"
    />
  );
}

// ── Editor Modal ───────────────────────────────────────────────────────────────

function ResumeEditorModal({
  initialHtml,
  onSave,
  onCancel,
}: {
  initialHtml: string;
  onSave: (html: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(initialHtml);

  // Key trick: re-mount editor when initialHtml changes so setContent is called fresh
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialHtml,          // ← set once at mount, no useEffect needed
    onUpdate: ({ editor }) => {
      setPreviewHtml(editor.getHTML());
    },
  });

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
    try {
      await onSave(editor.getHTML());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b shrink-0">
        <div>
          <h2 className="text-lg font-semibold">Edit Resume</h2>
          <p className="text-xs text-muted-foreground">
            Use the toolbar to format text — no HTML knowledge needed
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

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — rich text editor */}
        <div className="w-1/2 border-r flex flex-col overflow-hidden">
          <div className="text-xs font-medium text-muted-foreground px-4 py-2 border-b bg-muted/20">
            ✏️ Editor
          </div>
          <EditorToolbar editor={editor} />
          <div className="flex-1 overflow-auto p-4">
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none min-h-full focus:outline-none [&_.ProseMirror]:min-h-[600px] [&_.ProseMirror]:outline-none"
            />
          </div>
        </div>

        {/* Right — live preview */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="text-xs font-medium text-muted-foreground px-4 py-2 border-b bg-muted/20">
            👁 Live Preview
          </div>
          <div className="flex-1 bg-gray-50 overflow-hidden">
            <HtmlPreview html={previewHtml} />
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

  const handleBuildAI = async () => {
    if (!selectedResume) return;
    setBuildingAI(true);
    try {
      const html = await resumeService.buildWithAI(selectedResume.id);
      console.log("RAW RESULT:", html, typeof html);
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
      const updatedResume = await resumeService.updateResumeHtml(selectedResume.id, html);
      setSelectedResume(updatedResume);
      setIsEditingHtml(false);
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

      {/* Editor modal — re-mounts fresh each time via key */}
      {isEditingHtml && (
        <ResumeEditorModal
          key={htmlContent}
          initialHtml={htmlContent}
          onSave={handleSaveHtml}
          onCancel={() => setIsEditingHtml(false)}
        />
      )}
    </AuthGuard>
  );
}