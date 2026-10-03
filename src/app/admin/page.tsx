"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteContent, SectionType } from "@/types/content";
import { defaultSiteContent } from "@/lib/default-content";
import {
  getDraftContent,
  saveDraftContent,
  publishContent,
  verifyUserIsAdmin,
} from "@/lib/content-service";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { SectionSidebar } from "@/components/admin/SectionSidebar";
import { SectionForm } from "@/components/admin/SectionForm";
import { GlobalBrandForm } from "@/components/admin/GlobalBrandForm";
import { ResponsivePreview } from "@/components/admin/ResponsivePreview";
import confetti from "canvas-confetti";
import {
  Save,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  PanelLeftClose,
  PanelRightClose,
  Columns,
  LogOut,
  Sparkles,
} from "lucide-react";

function AdminEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExplicitSandbox = searchParams.get("mode") === "sandbox";

  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isDirty, setIsDirty] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<"split" | "editor" | "preview">("split");

  const supabaseReady = isSupabaseConfigured();

  // Authentication check with timeout safeguard
  useEffect(() => {
    // If sandbox mode is explicitly requested, bypass auth gate immediately
    if (isExplicitSandbox) {
      setAuthChecking(false);
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase || !supabaseReady) {
      setAuthChecking(false);
      return;
    }

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      setAuthChecking(false);
      router.push("/admin/login");
    }, 4000);

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (timedOut) return;
      clearTimeout(timer);

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const isAdmin = await verifyUserIsAdmin(user.id);
      if (!isAdmin) {
        router.push("/admin/login");
        return;
      }

      setUserEmail(user.email || "Admin");
      setAuthChecking(false);
    }).catch(() => {
      if (timedOut) return;
      clearTimeout(timer);
      setAuthChecking(false);
      router.push("/admin/login");
    });

    return () => clearTimeout(timer);
  }, [router, supabaseReady, isExplicitSandbox]);

  // Load draft content on initial mount
  useEffect(() => {
    getDraftContent().then((loaded) => {
      setContent(loaded);
      setIsDirty(false);
    });
  }, []);

  // Unsaved changes beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Content updater
  const handleContentChange = useCallback((updated: SiteContent) => {
    setContent(updated);
    setIsDirty(true);
  }, []);

  // Save Draft
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setStatusNotice(null);

    const res = await saveDraftContent(content);
    setIsSavingDraft(false);

    if (res.success) {
      setIsDirty(false);
      setStatusNotice({
        type: "success",
        text: res.notice || "Draft changes saved successfully.",
      });
      setTimeout(() => setStatusNotice(null), 3500);
    } else {
      setStatusNotice({ type: "error", text: res.error || "Failed to save draft." });
    }
  };

  // Publish Changes
  const handlePublish = async () => {
    if (!confirm("Are you sure you want to publish these changes live to the public website?")) {
      return;
    }

    setIsPublishing(true);
    setStatusNotice(null);

    const res = await publishContent(content, content.revision);
    setIsPublishing(false);

    if (res.success) {
      setIsDirty(false);
      setContent((prev) => ({
        ...prev,
        revision: res.revision,
      }));
      setStatusNotice({
        type: "success",
        text: res.notice || `Published successfully! Live Revision #${res.revision || "Latest"}.`,
      });

      // Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.2 },
          colors: ["#c6f36b", "#ffffff", "#38bdf8"],
        });
      } catch {
        // ignore
      }

      setTimeout(() => setStatusNotice(null), 5000);
    } else {
      setStatusNotice({ type: "error", text: res.error || "Publish failed. Please try again." });
    }
  };

  // Section Ordering Helpers
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newOrder = [...content.sectionOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    handleContentChange({ ...content, sectionOrder: newOrder });
  };

  const handleMoveDown = (index: number) => {
    if (index >= content.sectionOrder.length - 1) return;
    const newOrder = [...content.sectionOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    handleContentChange({ ...content, sectionOrder: newOrder });
  };

  const handleToggleVisibility = (sectionKey: SectionType) => {
    const isCurrentlyEnabled = content.sections[sectionKey].enabled;
    const updatedSections = {
      ...content.sections,
      [sectionKey]: {
        ...content.sections[sectionKey],
        enabled: !isCurrentlyEnabled,
      },
    };
    handleContentChange({ ...content, sections: updatedSections });
  };

  const handleDuplicate = (sectionKey: SectionType) => {
    // Add section again into order
    const newOrder = [...content.sectionOrder, sectionKey];
    handleContentChange({ ...content, sectionOrder: newOrder });
    setStatusNotice({ type: "success", text: `Duplicated section "${sectionKey}" in page flow.` });
    setTimeout(() => setStatusNotice(null), 2500);
  };

  const handleRemove = (sectionKey: SectionType) => {
    const newOrder = content.sectionOrder.filter((k) => k !== sectionKey);
    handleContentChange({ ...content, sectionOrder: newOrder });
  };

  const handleAddSection = (sectionKey: SectionType) => {
    const newOrder = [...content.sectionOrder, sectionKey];
    const updatedSections = {
      ...content.sections,
      [sectionKey]: {
        ...content.sections[sectionKey],
        enabled: true,
      },
    };
    handleContentChange({ ...content, sectionOrder: newOrder, sections: updatedSections });
    setActiveSection(sectionKey);
    setStatusNotice({ type: "success", text: `Added section "${sectionKey}" from template.` });
    setTimeout(() => setStatusNotice(null), 2500);
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#080809] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#c6f36b] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#90909c]">Verifying Administrative Credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080809] text-[#f5f5f7] flex flex-col selection:bg-[#c6f36b] selection:text-[#080809]">
      {/* Top Banner if in Sandbox Mode */}
      {(isExplicitSandbox || !supabaseReady) && (
        <div className="bg-amber-950/60 border-b border-amber-500/30 px-6 py-2 text-xs font-mono text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Interactive Sandbox Mode:</strong> Real-time editor, local drafts, and responsive preview enabled without credentials.
            </span>
          </div>
          <Link
            href="/admin/login"
            className="text-[11px] font-mono text-white underline hover:text-[#c6f36b]"
          >
            Authenticate with Supabase Cloud &rarr;
          </Link>
        </div>
      )}

      {/* TOP CMS BAR */}
      <header className="h-14 border-b border-white/[0.08] bg-[#0c0c0f] px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-[#90909c] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Studio</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide text-white">
              UIC CMS
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c6f36b] bg-[#c6f36b]/10 px-2 py-0.5 rounded-full border border-[#c6f36b]/30">
              Rev #{content.revision || 1}
            </span>
          </div>

          {/* Unsaved changes badge */}
          <div className="hidden sm:flex items-center">
            {isDirty ? (
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Unsaved Edits
              </span>
            ) : (
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Draft In Sync
              </span>
            )}
          </div>
        </div>

        {/* Center: Layout View Switcher */}
        <div className="hidden lg:flex items-center gap-1 bg-[#141418] border border-white/10 rounded-xl p-0.5">
          <button
            onClick={() => setLayoutMode("split")}
            className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors ${
              layoutMode === "split" ? "bg-white text-black font-semibold" : "text-[#90909c] hover:text-white"
            }`}
            title="Split Editor & Preview"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>

          <button
            onClick={() => setLayoutMode("editor")}
            className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors ${
              layoutMode === "editor" ? "bg-white text-black font-semibold" : "text-[#90909c] hover:text-white"
            }`}
            title="Full Editor Only"
          >
            <PanelRightClose className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            onClick={() => setLayoutMode("preview")}
            className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors ${
              layoutMode === "preview" ? "bg-white text-black font-semibold" : "text-[#90909c] hover:text-white"
            }`}
            title="Full Preview Only"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isPublishing}
            className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Save draft without publishing live"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSavingDraft ? "Saving..." : "Save Draft"}</span>
          </button>

          {/* Publish Live Button */}
          <button
            onClick={handlePublish}
            disabled={isPublishing || isSavingDraft}
            className="px-4 py-1.5 rounded-xl bg-[#c6f36b] hover:bg-[#b5e656] text-[#080809] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-md"
            title="Publish changes live to public site"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishing ? "Publishing..." : "Publish Live"}</span>
          </button>

          {/* User / Sign Out */}
          {supabaseReady && userEmail && (
            <button
              onClick={handleSignOut}
              className="p-1.5 text-[#90909c] hover:text-white rounded-lg border border-white/10"
              title={`Sign out (${userEmail})`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Floating Status Notification */}
      {statusNotice && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl text-xs font-mono flex items-center gap-2.5 shadow-2xl border animate-in slide-in-from-bottom-2 duration-200 ${
            statusNotice.type === "success"
              ? "bg-[#141f10] border-[#c6f36b]/60 text-white"
              : "bg-red-950 border-red-500/60 text-red-200"
          }`}
        >
          {statusNotice.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-[#c6f36b] flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{statusNotice.text}</span>
        </div>
      )}

      {/* MAIN CMS WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Section Navigation Sidebar */}
        {layoutMode !== "preview" && (
          <SectionSidebar
            sectionOrder={content.sectionOrder}
            activeSection={activeSection}
            onSelectSection={(sec) => setActiveSection(sec)}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onToggleVisibility={handleToggleVisibility}
            onDuplicate={handleDuplicate}
            onRemove={handleRemove}
            onAddSection={handleAddSection}
            isSectionVisible={(sec) => content.sections[sec]?.enabled ?? true}
          />
        )}

        {/* MIDDLE COLUMN: Form Editor */}
        {layoutMode !== "preview" && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#08080a]">
            {activeSection === "brand" ? (
              <GlobalBrandForm
                brand={content.brand}
                seo={content.seo}
                activeTab="brand"
                onChangeBrand={(brand) => handleContentChange({ ...content, brand })}
                onChangeSeo={(seo) => handleContentChange({ ...content, seo })}
              />
            ) : activeSection === "seo" ? (
              <GlobalBrandForm
                brand={content.brand}
                seo={content.seo}
                activeTab="seo"
                onChangeBrand={(brand) => handleContentChange({ ...content, brand })}
                onChangeSeo={(seo) => handleContentChange({ ...content, seo })}
              />
            ) : (
              <SectionForm
                sectionKey={activeSection as SectionType}
                content={content}
                onChangeContent={handleContentChange}
              />
            )}
          </div>
        )}

        {/* RIGHT COLUMN: Real-Time Responsive Live Preview */}
        {layoutMode !== "editor" && (
          <div className={`${layoutMode === "preview" ? "w-full" : "w-1/2"} flex-shrink-0`}>
            <ResponsivePreview content={content} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080809] flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#c6f36b] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-[#90909c]">Loading Studio CMS...</span>
          </div>
        </div>
      }
    >
      <AdminEditorContent />
    </Suspense>
  );
}

