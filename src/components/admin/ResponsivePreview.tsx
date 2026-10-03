"use client";

import React, { useState } from "react";
import { SiteContent } from "@/types/content";
import { Header } from "@/components/Header";
import { SectionRenderer } from "@/components/SectionRenderer";
import { Footer } from "@/components/Footer";
import { Monitor, Tablet, Smartphone, ExternalLink, RotateCcw } from "lucide-react";

interface ResponsivePreviewProps {
  content: SiteContent;
}

export type ViewportMode = "desktop" | "tablet" | "mobile";

export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({ content }) => {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [previewKey, setPreviewKey] = useState(0);

  const getContainerWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[390px]";
      case "tablet":
        return "max-w-[768px]";
      case "desktop":
      default:
        return "w-full";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050506] border-l border-white/[0.08] overflow-hidden">
      {/* Top Preview Controls Bar */}
      <div className="p-3 border-b border-white/[0.08] bg-[#0a0a0d] flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#141418] border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setViewport("desktop")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              viewport === "desktop"
                ? "bg-white text-[#080809] font-medium"
                : "text-[#90909c] hover:text-white"
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setViewport("tablet")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              viewport === "tablet"
                ? "bg-white text-[#080809] font-medium"
                : "text-[#90909c] hover:text-white"
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setViewport("mobile")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              viewport === "mobile"
                ? "bg-white text-[#080809] font-medium"
                : "text-[#90909c] hover:text-white"
            }`}
            title="Mobile 390px"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewKey((prev) => prev + 1)}
            className="p-1.5 rounded-lg text-[#90909c] hover:text-white bg-white/[0.04] border border-white/10"
            title="Reset preview position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-[#90909c] hover:text-white bg-white/[0.04] border border-white/10 flex items-center gap-1"
            title="Open Live Public Site in new tab"
          >
            <span className="hidden sm:inline">Live Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Preview Viewport Frame */}
      <div className="flex-1 bg-[#060608] overflow-y-auto p-4 flex justify-center items-start">
        <div
          key={previewKey}
          className={`${getContainerWidth()} min-h-full transition-all duration-300 relative isolate [transform:translateZ(0)] overflow-hidden ${
            viewport !== "desktop"
              ? "rounded-[32px] border-4 border-[#222228] shadow-[0_25px_60px_rgba(0,0,0,0.9)] my-4"
              : "w-full rounded-2xl border border-white/[0.06] shadow-xl"
          }`}
        >
          {/* Internal Scrollable Content */}
          <div className="min-h-screen bg-[#080809] text-[#f5f5f7] relative isolate">
            <Header brand={content.brand} isEmbeddedPreview={true} />
            <SectionRenderer content={content} />
            {content.sections.footer.enabled && (
              <Footer
                content={content.sections.footer}
                brand={content.brand}
                accentColor={content.brand.accentColor}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
