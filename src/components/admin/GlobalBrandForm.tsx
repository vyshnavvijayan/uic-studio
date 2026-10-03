"use client";

import React from "react";
import { BrandSettings, SeoMetadata } from "@/types/content";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Palette, Mail, Link as LinkIcon, Plus, Trash2 } from "lucide-react";

interface GlobalBrandFormProps {
  brand: BrandSettings;
  seo: SeoMetadata;
  activeTab: "brand" | "seo";
  onChangeBrand: (updated: BrandSettings) => void;
  onChangeSeo: (updated: SeoMetadata) => void;
}

const colorPresets = [
  { name: "Signature Lime", color: "#c6f36b" },
  { name: "Cyan Matrix", color: "#38bdf8" },
  { name: "Pure Platinum", color: "#e4e4e7" },
  { name: "24K Gold", color: "#facc15" },
  { name: "Electric Emerald", color: "#34d399" },
  { name: "Cyber Amber", color: "#fb923c" },
];

export const GlobalBrandForm: React.FC<GlobalBrandFormProps> = ({
  brand,
  seo,
  activeTab,
  onChangeBrand,
  onChangeSeo,
}) => {
  if (activeTab === "seo") {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">SEO & Meta Configuration</h2>
          <p className="text-xs text-[#90909c] mt-1">
            Global search indexing, OpenGraph card graphics, and social share descriptions.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Page Title
            </label>
            <input
              type="text"
              value={seo.title}
              onChange={(e) => onChangeSeo({ ...seo, title: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={seo.description}
              onChange={(e) => onChangeSeo({ ...seo, description: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b] resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Target SEO Keywords (Comma Separated)
            </label>
            <input
              type="text"
              value={seo.keywords}
              onChange={(e) => onChangeSeo({ ...seo, keywords: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
            />
          </div>

          <MediaUploader
            label="Social Share OpenGraph Image"
            currentUrl={seo.ogImage}
            onUrlChange={(url) => onChangeSeo({ ...seo, ogImage: url })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-white">Brand Architecture & Settings</h2>
        <p className="text-xs text-[#90909c] mt-1">
          Customize your wordmark, global accent color, primary contact routing, and navigation.
        </p>
      </div>

      {/* Wordmark and Primary Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
            Studio Wordmark
          </label>
          <input
            type="text"
            value={brand.wordmark}
            onChange={(e) => onChangeBrand({ ...brand, wordmark: e.target.value })}
            className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
          />
        </div>

        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
            Primary Contact Email
          </label>
          <input
            type="email"
            value={brand.contactEmail}
            onChange={(e) => onChangeBrand({ ...brand, contactEmail: e.target.value })}
            className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
          />
        </div>
      </div>

      {/* Accent Color Customizer & Presets */}
      <div className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#c6f36b]" />
            <span className="text-xs font-mono uppercase tracking-wider text-white">
              Accent Color Token
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={brand.accentColor}
              onChange={(e) => onChangeBrand({ ...brand, accentColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-white/20 p-0"
            />
            <span className="text-xs font-mono text-white uppercase">{brand.accentColor}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/[0.06]">
          <span className="text-[10px] font-mono uppercase text-[#585863] mr-2">
            Presets:
          </span>
          {colorPresets.map((p) => (
            <button
              key={p.name}
              onClick={() => onChangeBrand({ ...brand, accentColor: p.color })}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono border flex items-center gap-1.5 transition-colors ${
                brand.accentColor.toLowerCase() === p.color.toLowerCase()
                  ? "bg-white/10 border-white text-white"
                  : "bg-white/[0.02] border-white/10 text-[#90909c] hover:border-white/30 hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Items Manager */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#90909c]">
            Top Navigation Menu Items
          </span>
          <button
            onClick={() =>
              onChangeBrand({
                ...brand,
                navItems: [
                  ...brand.navItems,
                  { id: `nav-${Date.now()}`, label: "New Link", href: "#" },
                ],
              })
            }
            className="text-xs font-mono text-[#c6f36b] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Nav Link</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {brand.navItems.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="text"
                value={item.label}
                onChange={(e) => {
                  const updated = [...brand.navItems];
                  updated[idx] = { ...item, label: e.target.value };
                  onChangeBrand({ ...brand, navItems: updated });
                }}
                placeholder="Label"
                className="w-1/3 bg-[#161619] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => {
                  const updated = [...brand.navItems];
                  updated[idx] = { ...item, href: e.target.value };
                  onChangeBrand({ ...brand, navItems: updated });
                }}
                placeholder="Destination (#section or url)"
                className="flex-1 bg-[#161619] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#c6f36b]"
              />
              <button
                onClick={() => {
                  const updated = brand.navItems.filter((_, i) => i !== idx);
                  onChangeBrand({ ...brand, navItems: updated });
                }}
                className="p-2 rounded-lg text-[#585863] hover:text-red-400"
                title="Remove link"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
