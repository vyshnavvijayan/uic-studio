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

  // Sync if updated in local storage via CMS
  useEffect(() => {
    const handleStorageChange = () => {
      getPublishedContent().then(setContent);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
