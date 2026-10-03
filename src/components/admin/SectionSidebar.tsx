"use client";

import React, { useState } from "react";
import { SectionType } from "@/types/content";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Sliders,
  Sparkles,
  Layers,
  Layout,
  Globe,
} from "lucide-react";

interface SectionSidebarProps {
  sectionOrder: SectionType[];
  activeSection: string;
  onSelectSection: (sectionKey: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onToggleVisibility: (sectionKey: SectionType) => void;
  onDuplicate: (sectionKey: SectionType) => void;
  onRemove: (sectionKey: SectionType) => void;
  onAddSection: (sectionKey: SectionType) => void;
  isSectionVisible: (sectionKey: SectionType) => boolean;
}

const sectionLabels: Record<SectionType, string> = {
  hero: "Hero (Scroll Sequence)",
  studioIntro: "Studio Manifesto & Stats",
  services: "Services Bento Grid",
  nfcShowcase: "NFC 3D Card Stack",
  work: "Selected Work Gallery",
  process: "4-Stage Methodology",
  testimonials: "Testimonials Marquee",
  faq: "FAQ Accordion",
  contact: "Contact & Commission CTA",
};

export const SectionSidebar: React.FC<SectionSidebarProps> = ({
  sectionOrder,
  activeSection,
  onSelectSection,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onDuplicate,
  onRemove,
  onAddSection,
  isSectionVisible,
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const availableTemplates: SectionType[] = [
    "hero",
    "studioIntro",
    "services",
    "nfcShowcase",
    "work",
    "process",
    "testimonials",
    "faq",
    "contact",
  ];

  return (
    <aside className="w-80 flex-shrink-0 bg-[#0d0d10] border-r border-white/[0.08] flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#90909c] block">
            Page Layout
          </span>
          <span className="text-sm font-semibold text-white">
            Sections ({sectionOrder.length})
          </span>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="p-1.5 rounded-lg bg-[#c6f36b]/10 text-[#c6f36b] hover:bg-[#c6f36b] hover:text-[#080809] transition-colors flex items-center gap-1 text-xs font-mono font-medium px-2.5 py-1"
          title="Add Section from Template"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Global Brand & SEO Settings Switcher */}
      <div className="p-3 border-b border-white/[0.08] flex gap-2">
        <button
          onClick={() => onSelectSection("brand")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono text-left transition-colors flex items-center gap-2 ${
            activeSection === "brand"
              ? "bg-[#c6f36b] text-[#080809] font-semibold"
              : "bg-white/[0.03] text-[#90909c] hover:text-white border border-white/[0.06]"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Brand Settings</span>
        </button>

        <button
          onClick={() => onSelectSection("seo")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono text-left transition-colors flex items-center gap-2 ${
            activeSection === "seo"
              ? "bg-[#c6f36b] text-[#080809] font-semibold"
              : "bg-white/[0.03] text-[#90909c] hover:text-white border border-white/[0.06]"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>SEO & Meta</span>
        </button>
      </div>

      {/* Section List (Ordered) */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {sectionOrder.map((sectionKey, index) => {
          const isSelected = activeSection === sectionKey;
          const visible = isSectionVisible(sectionKey);

          return (
            <div
              key={`${sectionKey}-${index}`}
              onClick={() => onSelectSection(sectionKey)}
              className={`group p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                isSelected
                  ? "bg-[#18181c] border-[#c6f36b]/60 shadow-lg"
                  : "bg-[#121215] border-white/[0.06] hover:border-white/20"
              }`}
            >
              {/* Section Item Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-[10px] font-mono text-[#585863] w-4">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-xs font-medium truncate ${
                      isSelected ? "text-white" : "text-[#c2c2ce]"
                    }`}
                  >
                    {sectionLabels[sectionKey] || sectionKey}
                  </span>
                </div>

                {/* Visibility Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(sectionKey);
                  }}
                  className={`p-1 rounded hover:bg-white/10 transition-colors ${
                    visible ? "text-[#c6f36b]" : "text-[#585863]"
                  }`}
                  title={visible ? "Section is visible" : "Section is hidden"}
                >
                  {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Action Controls: Move Up/Down, Duplicate, Delete */}
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[#585863]">
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveUp(index);
                    }}
                    className="p-1 rounded hover:text-white disabled:opacity-20 transition-colors"
                    title="Move section up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    disabled={index === sectionOrder.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveDown(index);
                    }}
                    className="p-1 rounded hover:text-white disabled:opacity-20 transition-colors"
                    title="Move section down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(sectionKey);
                    }}
                    className="p-1 rounded hover:text-[#c6f36b] transition-colors"
                    title="Duplicate section"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove "${sectionLabels[sectionKey]}" section from page?`)) {
                        onRemove(sectionKey);
                      }
                    }}
                    className="p-1 rounded hover:text-red-400 transition-colors"
                    title="Remove section"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Section Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-[#0f0f12] border border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
            <div>
              <h3 className="text-base font-semibold text-white">
                Add Section from Template
              </h3>
              <p className="text-xs text-[#90909c] mt-1">
                Select a section template to insert into your landing page flow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto">
              {availableTemplates.map((templateKey) => (
                <button
                  key={templateKey}
                  onClick={() => {
                    onAddSection(templateKey);
                    setAddModalOpen(false);
                  }}
                  className="p-3 rounded-xl border border-white/[0.06] bg-[#141418] hover:border-[#c6f36b] hover:bg-[#1a1a20] text-left transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-medium text-white block">
                      {sectionLabels[templateKey]}
                    </span>
                    <span className="text-[10px] font-mono text-[#585863]">
                      Template ID: {templateKey}
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-[#c6f36b]" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setAddModalOpen(false)}
              className="mt-2 w-full py-2.5 rounded-xl border border-white/10 text-xs font-mono text-[#90909c] hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
