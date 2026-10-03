"use client";

import React, { useState, useEffect } from "react";
import { SiteContent } from "@/types/content";
import { Header } from "@/components/Header";
import { SectionRenderer } from "@/components/SectionRenderer";
import { Footer } from "@/components/Footer";
import { InquiryModal } from "@/components/InquiryModal";
import { getPublishedContent } from "@/lib/content-service";

interface ClientAppProps {
  initialContent: SiteContent;
}

export const ClientApp: React.FC<ClientAppProps> = ({ initialContent }) => {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  // Sync on initial mount AND on storage / published events
  useEffect(() => {
    // 1. Immediately sync with latest published content on browser mount
    getPublishedContent().then((latest) => {
      if (latest && latest.revision !== initialContent.revision) {
        setContent(latest);
      }
    });

    // 2. Listen for storage events (from other tabs) and custom content update events (same tab)
    const handleSync = () => {
      getPublishedContent().then(setContent);
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("uic:content-updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("uic:content-updated", handleSync);
    };
  }, [initialContent.revision]);

  return (
    <div className="min-h-screen bg-[#080809] text-[#f5f5f7] flex flex-col selection:bg-[#c6f36b] selection:text-[#080809]">
      <Header
        brand={content.brand}
        onOpenInquiry={() => setInquiryModalOpen(true)}
      />

      <SectionRenderer
        content={content}
        onOpenInquiry={() => setInquiryModalOpen(true)}
      />

      {content.sections.footer.enabled && (
        <Footer
          content={content.sections.footer}
          brand={content.brand}
          accentColor={content.brand.accentColor}
        />
      )}

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        targetEmail={content.sections.contact.email || "design@uic.studio"}
      />
    </div>
  );
};
