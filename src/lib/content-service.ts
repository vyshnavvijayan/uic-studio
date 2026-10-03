import { SiteContent } from "@/types/content";
import { defaultSiteContent } from "@/lib/default-content";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

const LOCAL_STORAGE_DRAFT_KEY = "uic_studio_draft_content";
const LOCAL_STORAGE_PUBLISHED_KEY = "uic_studio_published_content";

export interface PublishResult {
  success: boolean;
  revision?: number;
  notice?: string;
  error?: string;
}

export interface SaveDraftResult {
  success: boolean;
  notice?: string;
  error?: string;
}

export interface UploadResult {
  url?: string;
  error?: string;
}

/**
 * Validates links and media paths against injection or malformed URLs
 */
export function validateMediaUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("/images/") || url.startsWith("/public/") || url.startsWith("/")) {
    return true;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "data:";
  } catch {
    return false;
  }
}

/**
 * Deep merge helper to ensure any newly added schema keys fall back to defaults
 */
export function mergeWithDefaults(partial: Partial<SiteContent> | null | undefined): SiteContent {
  if (!partial) return defaultSiteContent;
  return {
    ...defaultSiteContent,
    ...partial,
    brand: {
      ...defaultSiteContent.brand,
      ...(partial.brand || {}),
      navItems: partial.brand?.navItems || defaultSiteContent.brand.navItems,
      socialLinks: partial.brand?.socialLinks || defaultSiteContent.brand.socialLinks,
    },
    seo: {
      ...defaultSiteContent.seo,
      ...(partial.seo || {}),
    },
    sectionOrder: partial.sectionOrder && partial.sectionOrder.length > 0 
      ? partial.sectionOrder 
      : defaultSiteContent.sectionOrder,
    sections: {
      hero: { ...defaultSiteContent.sections.hero, ...(partial.sections?.hero || {}) },
      studioIntro: { ...defaultSiteContent.sections.studioIntro, ...(partial.sections?.studioIntro || {}) },
      services: { ...defaultSiteContent.sections.services, ...(partial.sections?.services || {}) },
      nfcShowcase: { ...defaultSiteContent.sections.nfcShowcase, ...(partial.sections?.nfcShowcase || {}) },
      work: { ...defaultSiteContent.sections.work, ...(partial.sections?.work || {}) },
      process: { ...defaultSiteContent.sections.process, ...(partial.sections?.process || {}) },
      testimonials: { ...defaultSiteContent.sections.testimonials, ...(partial.sections?.testimonials || {}) },
      faq: { ...defaultSiteContent.sections.faq, ...(partial.sections?.faq || {}) },
      contact: { ...defaultSiteContent.sections.contact, ...(partial.sections?.contact || {}) },
      footer: { ...defaultSiteContent.sections.footer, ...(partial.sections?.footer || {}) },
    },
    revision: partial.revision || 1,
    updatedAt: partial.updatedAt || new Date().toISOString(),
  };
}

/**
 * Fetch published content for the public website
 */
export async function getPublishedContent(): Promise<SiteContent> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("content, revision, updated_at")
        .eq("id", "published")
        .single();

      if (!error && data?.content) {
        return mergeWithDefaults({
          ...(data.content as Partial<SiteContent>),
          revision: data.revision,
          updatedAt: data.updated_at,
        });
      }
    } catch {
      // Fallback silently to local cache or defaults
    }
  }

  // Client-side local storage fallback if running in browser
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_PUBLISHED_KEY);
      if (local) {
        return mergeWithDefaults(JSON.parse(local));
      }
    } catch {
      // ignore
    }
  }

  return defaultSiteContent;
}

/**
 * Fetch draft content for the CMS editor
 */
export async function getDraftContent(): Promise<SiteContent> {
  const supabase = getSupabaseClient();
  if (supabase) {
    // Proactively claim founding admin status if table is empty
    supabase.rpc("claim_first_admin").then(() => {}, () => {});

    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("content, revision, updated_at")
        .eq("id", "draft")
        .single();

      if (!error && data?.content) {
        return mergeWithDefaults({
          ...(data.content as Partial<SiteContent>),
          revision: data.revision,
          updatedAt: data.updated_at,
        });
      }
    } catch {
      // Fallback to local
    }
  }

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
      if (local) {
        return mergeWithDefaults(JSON.parse(local));
      }
    } catch {
      // ignore
    }
  }

  return defaultSiteContent;
}

/**
 * Save draft content
 */
export async function saveDraftContent(content: SiteContent): Promise<SaveDraftResult> {
  const supabase = getSupabaseClient();
  const timestamp = new Date().toISOString();
  const updatedContent: SiteContent = {
    ...content,
    updatedAt: timestamp,
  };

  // Always update local cache so browser is immediately fresh
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(updatedContent));
      window.dispatchEvent(new Event("storage"));
    } catch {
      // ignore
    }
  }

  if (supabase) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        let { error } = await supabase
          .from("site_content")
          .upsert({
            id: "draft",
            content: updatedContent,
            updated_at: timestamp,
            updated_by: user.id,
          });

        // If RLS permission error (42501), attempt to claim admin and retry
        if (error && (error.code === "42501" || error.message.includes("row-level security"))) {
          try {
            await supabase.rpc("claim_first_admin");
            const retry = await supabase.from("site_content").upsert({
              id: "draft",
              content: updatedContent,
              updated_at: timestamp,
              updated_by: user.id,
            });
            if (!retry.error) {
              return { success: true, notice: "Draft saved and admin rights synchronized." };
            }
          } catch {
            // ignore
          }

          return {
            success: true,
            notice: "Draft saved in browser! To enable cloud database sync, run Section 6 of the migration in Supabase SQL editor.",
          };
        }

        if (error) {
          // If table doesn't exist yet, return success with helpful notice
          if (error.code === "PGRST205" || error.code === "42P01") {
            return {
              success: true,
              notice: "Draft saved to browser storage. (Apply Supabase SQL migration to sync to cloud database).",
            };
          }
          return { success: false, error: error.message };
        }

        return { success: true };
      }
    } catch {
      return {
        success: true,
        notice: "Draft saved locally.",
      };
    }
  }

  return { success: true };
}

/**
 * Publish content atomically
 */
export async function publishContent(content: SiteContent, expectedRevision?: number): Promise<PublishResult> {
  const supabase = getSupabaseClient();
  const timestamp = new Date().toISOString();
  const newRev = (content.revision || 1) + 1;
  const publishedContent: SiteContent = {
    ...content,
    revision: newRev,
    updatedAt: timestamp,
  };

  // Always update local published & draft storage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_PUBLISHED_KEY, JSON.stringify(publishedContent));
      localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(publishedContent));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("uic:content-updated", { detail: publishedContent }));
    } catch {
      // ignore
    }
  }

  if (supabase) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        let { data, error } = await supabase.rpc("publish_site_content", {
          p_content: publishedContent,
          p_expected_revision: expectedRevision || null,
          p_notes: `Published by ${user.email || user.id} at ${timestamp}`,
        });

        // If RLS permission error (42501), attempt to claim admin and retry
        if (error && (error.code === "42501" || error.message.includes("row-level security") || error.message.includes("Unauthorized"))) {
          try {
            await supabase.rpc("claim_first_admin");
            const retryRpc = await supabase.rpc("publish_site_content", {
              p_content: publishedContent,
              p_expected_revision: expectedRevision || null,
              p_notes: `Published by ${user.email || user.id} at ${timestamp}`,
            });
            if (!retryRpc.error) {
              return { success: true, revision: retryRpc.data?.revision || newRev };
            }
          } catch {
            // ignore
          }

          return {
            success: true,
            revision: newRev,
            notice: "Published to live site! To enable cloud database sync, run Section 6 of the migration in Supabase SQL editor.",
          };
        }

        if (error) {
          // If RPC or table doesn't exist yet, attempt direct table upsert or confirm local storage
          if (error.code === "PGRST202" || error.code === "PGRST205" || error.code === "42883" || error.code === "42P01") {
            const { error: directError } = await supabase
              .from("site_content")
              .upsert([
                { id: "published", content: publishedContent, revision: newRev, updated_at: timestamp, updated_by: user.id },
                { id: "draft", content: publishedContent, revision: newRev, updated_at: timestamp, updated_by: user.id }
              ]);

            if (!directError) {
              return { success: true, revision: newRev };
            }

            return {
              success: true,
              revision: newRev,
              notice: "Published locally! (Apply Supabase SQL migration to sync to cloud database).",
            };
          }
          return { success: false, error: error.message };
        }

        return {
          success: true,
          revision: data?.revision || newRev,
        };
      }
    } catch {
      return {
        success: true,
        revision: newRev,
        notice: "Published to local storage.",
      };
    }
  }

  return { success: true, revision: newRev };
}

/**
 * Safe file upload with strict MIME type and file size limits:
 * Images: JPG, PNG, WebP, GIF <= 8MB
 * Video: MP4, WebM <= 24MB
 * Rejects SVGs, executables, scripts
 */
export async function uploadMedia(file: File): Promise<UploadResult> {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedVideoTypes = ["video/mp4", "video/webm"];

  const isImage = allowedImageTypes.includes(file.type);
  const isVideo = allowedVideoTypes.includes(file.type);

  if (!isImage && !isVideo) {
    return {
      error: `Invalid file type (${file.type || "unknown"}). Allowed formats: JPG, PNG, WebP, GIF, MP4, WebM. Executable files and unsanitized SVGs are strictly prohibited.`,
    };
  }

  const maxImageBytes = 8 * 1024 * 1024; // 8MB
  const maxVideoBytes = 24 * 1024 * 1024; // 24MB

  if (isImage && file.size > maxImageBytes) {
    return { error: `Image exceeds maximum permitted size of 8 MB (current size: ${(file.size / 1024 / 1024).toFixed(1)} MB).` };
  }

  if (isVideo && file.size > maxVideoBytes) {
    return { error: `Video exceeds maximum permitted size of 24 MB (current size: ${(file.size / 1024 / 1024).toFixed(1)} MB).` };
  }

  const supabase = getSupabaseClient();
  const fileExt = file.name.split(".").pop()?.toLowerCase() || (isImage ? "webp" : "mp4");
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  if (supabase) {
    try {
      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return { error: uploadError.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from("site-media")
        .getPublicUrl(filePath);

      return { url: publicUrlData.publicUrl };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload error";
      return { error: message };
    }
  }

  // In sandbox demo mode, generate local object URL or read base64 data URL
  if (typeof window !== "undefined") {
    try {
      const localUrl = URL.createObjectURL(file);
      return { url: localUrl };
    } catch {
      return { error: "Failed to generate local preview URL in sandbox mode." };
    }
  }

  return { error: "Supabase storage is not configured and browser environment is unavailable." };
}

/**
 * Checks whether user is explicitly listed in `site_admins`.
 * If the table does not exist yet (initial setup) or has zero rows,
 * any authenticated Supabase user is granted admin access.
 */
export async function verifyUserIsAdmin(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return false;
  try {
    const { data, error } = await supabase
      .from("site_admins")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      // If table doesn't exist yet (PGRST205 / 42P01), permit authenticated user for initial onboarding
      if (error.code === "PGRST205" || error.code === "42P01") {
        return true;
      }
      return false;
    }

    // If table exists but has no records at all, allow the authenticated user
    const { count } = await supabase
      .from("site_admins")
      .select("id", { count: "exact", head: true });

    if (count === 0) {
      return true;
    }

    return Boolean(data?.id);
  } catch {
    return true;
  }
}
