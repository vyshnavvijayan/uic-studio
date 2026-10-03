"use client";

import React, { useState } from "react";
import { ContactSectionContent } from "@/types/content";
import { Copy, Check, ArrowUpRight, Sparkles } from "lucide-react";

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
    <section
      id="contact"
      className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-zinc-200 dark:border-white/[0.06] bg-[var(--bg-primary)]/80 dark:bg-[var(--bg-primary)] backdrop-blur-xs transition-colors duration-300 overflow-hidden"
    >
      {/* Decorative Rotating Geometric Accents */}
      <div className="absolute -bottom-10 -right-10 w-72 h-72 pointer-events-none opacity-35 dark:opacity-10 animate-float-slow">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full animate-spin-reverse-slow">
          <circle cx="100" cy="100" r="85" stroke="url(#contactGrad)" strokeWidth="1.2" strokeDasharray="12 8" />
          <polygon points="100,20 180,140 20,140" stroke="url(#contactGrad)" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" stroke="url(#contactGrad)" strokeWidth="1" />
          <defs>
            <linearGradient id="contactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl">
          {/* Section Tag */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: accentColor }} />
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-[#90909c] font-medium">
              {content.label || "Direct Engagement"}
            </span>
            <span className="text-xs font-mono text-zinc-400 dark:text-[#585863]">/ 08</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-[#f5f5f7] leading-tight mb-8">
            {content.title}
          </h2>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-[#90909c] leading-relaxed font-light mb-12 max-w-2xl">
            {content.subtitle}
          </p>

          {/* Contact Actions Box with Vibrant Light-Theme Styling */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white via-indigo-50/20 to-cyan-50/30 dark:bg-none dark:bg-[#0d0d10] border border-zinc-200/90 dark:border-white/[0.08] shadow-[0_20px_50px_-15px_rgba(99,102,241,0.12)] dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-[#c6f36b] animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-[#c6f36b] font-semibold">
                  {content.availabilityStatus || "Available for Commissions"}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <a
                  href={`mailto:${content.email}`}
                  className="text-2xl sm:text-4xl font-mono font-medium text-zinc-950 dark:text-white hover:text-indigo-600 dark:hover:text-[#c6f36b] transition-colors underline decoration-indigo-200 dark:decoration-white/20 underline-offset-8"
                >
                  {content.email}
                </a>

                {/* Copy Email Button */}
                <button
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] hover:border-indigo-300 dark:hover:border-white/20 text-zinc-700 dark:text-[#90909c] hover:text-indigo-600 dark:hover:text-white transition-colors shadow-2xs"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-[#c6f36b]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <span className="text-xs text-zinc-500 dark:text-[#585863] font-mono mt-3 block">
                {content.responseTimeNotice || "Inquiries reviewed within one business day."}
              </span>
            </div>

            {/* Structured Inquiry Modal Trigger */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onOpenInquiry}
                className="rounded-full bg-[#c6f36b] text-zinc-950 hover:bg-[#b5e656] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Format Commission Inquiry</span>
              </button>

              <a
                href={`mailto:${content.email}?subject=Commission%20Inquiry%20%E2%80%94%20UIC%20Studio`}
                className="text-center text-xs font-mono text-zinc-600 dark:text-[#90909c] hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center justify-center gap-1 font-medium"
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
