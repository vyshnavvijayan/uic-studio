"use client";

import React, { useState } from "react";
import { ContactSectionContent } from "@/types/content";
import { Mail, Copy, Check, ArrowUpRight, Sparkles } from "lucide-react";

interface ContactProps {
  content: ContactSectionContent;
  accentColor?: string;
  onOpenInquiry?: () => void;
}

export const Contact: React.FC<ContactProps> = ({
  content,
  accentColor = "#c6f36b",
  onOpenInquiry,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(content.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-white/[0.06] bg-[#080809]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl">
          {/* Section Tag */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-xs font-mono uppercase tracking-widest text-[#90909c]">
              {content.label || "Direct Engagement"}
            </span>
            <span className="text-xs font-mono text-[#585863]">/ 08</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#f5f5f7] leading-tight mb-8">
            {content.title}
          </h2>

          <p className="text-base sm:text-xl text-[#90909c] leading-relaxed font-light mb-12 max-w-2xl">
            {content.subtitle}
          </p>

          {/* Contact Actions Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0d0d10] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#c6f36b] animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#c6f36b]">
                  {content.availabilityStatus || "Available for Commissions"}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <a
                  href={`mailto:${content.email}`}
                  className="text-2xl sm:text-4xl font-mono font-medium text-white hover:text-[#c6f36b] transition-colors underline decoration-white/20 underline-offset-8"
                >
                  {content.email}
                </a>

                {/* Copy Email Button */}
                <button
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-[#90909c] hover:text-white transition-colors"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#c6f36b]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <span className="text-xs text-[#585863] font-mono mt-3 block">
                {content.responseTimeNotice || "Inquiries reviewed within one business day."}
              </span>
            </div>

            {/* Structured Inquiry Modal Trigger */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onOpenInquiry}
                className="rounded-full bg-[#c6f36b] text-[#080809] hover:bg-[#b5e656] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Format Commission Inquiry</span>
              </button>

              <a
                href={`mailto:${content.email}?subject=Commission%20Inquiry%20%E2%80%94%20UIC%20Studio`}
                className="text-center text-xs font-mono text-[#90909c] hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <span>Direct Mailto Client</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
