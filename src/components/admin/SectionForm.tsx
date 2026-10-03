"use client";

import React from "react";
import { SiteContent, SectionType } from "@/types/content";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

interface SectionFormProps {
  sectionKey: SectionType;
  content: SiteContent;
  onChangeContent: (updated: SiteContent) => void;
}

export const SectionForm: React.FC<SectionFormProps> = ({
  sectionKey,
  content,
  onChangeContent,
}) => {
  const { sections } = content;

  // Helper to update a single section
  const updateSection = <K extends keyof typeof sections>(
    key: K,
    updatedData: Partial<(typeof sections)[K]>
  ) => {
    onChangeContent({
      ...content,
      sections: {
        ...sections,
        [key]: {
          ...sections[key],
          ...updatedData,
        },
      },
    });
  };

  switch (sectionKey) {
    case "hero": {
      const hero = sections.hero;
      return (
        <div className="flex flex-col gap-6 max-w-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">Hero Scroll Sequence Settings</h2>
            <p className="text-xs text-[#90909c] mt-1">
              Controls the cinematic 44-frame canvas sequence, opening typography, and climax headline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Headline (Line 1)
              </label>
              <input
                type="text"
                value={hero.headlineLine1}
                onChange={(e) => updateSection("hero", { headlineLine1: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Headline (Line 2 - Gradient)
              </label>
              <input
                type="text"
                value={hero.headlineLine2}
                onChange={(e) => updateSection("hero", { headlineLine2: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Supporting Subtitle Text
            </label>
            <textarea
              rows={2}
              value={hero.subtitle}
              onChange={(e) => updateSection("hero", { subtitle: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b] resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Closing Climax Headline (Fades in near bottom)
            </label>
            <input
              type="text"
              value={hero.closingHeadline}
              onChange={(e) => updateSection("hero", { closingHeadline: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
            />
          </div>

          {/* Playback Mode Switcher */}
          <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-white block">
              Hero Rendering Engine
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateSection("hero", { mode: "frames" })}
                className={`py-2 px-3 rounded-lg text-xs font-mono text-left transition-colors border ${
                  (hero.mode || "frames") === "frames"
                    ? "bg-[#c6f36b] text-[#080809] border-[#c6f36b] font-semibold"
                    : "bg-white/[0.02] border-white/10 text-[#90909c] hover:text-white"
                }`}
              >
                Enhanced 44-Frame Sequence (Sitting → Walking)
              </button>
              <button
                type="button"
                onClick={() => updateSection("hero", { mode: "remastered" })}
                className={`py-2 px-3 rounded-lg text-xs font-mono text-left transition-colors border ${
                  hero.mode === "remastered"
                    ? "bg-[#c6f36b] text-[#080809] border-[#c6f36b] font-semibold"
                    : "bg-white/[0.02] border-white/10 text-[#90909c] hover:text-white"
                }`}
              >
                8K Remastered Keyframes Mode
              </button>
            </div>
          </div>

          <MediaUploader
            label="Hero Cinematic Visual / Poster Image"
            currentUrl={hero.cinematicImageUrl || hero.posterUrl}
            onUrlChange={(url) => updateSection("hero", { cinematicImageUrl: url, posterUrl: url })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Total Frames Count
              </label>
              <input
                type="number"
                value={hero.totalFrames}
                onChange={(e) => updateSection("hero", { totalFrames: parseInt(e.target.value) || 44 })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Explore Link Label
              </label>
              <input
                type="text"
                value={hero.exploreText}
                onChange={(e) => updateSection("hero", { exploreText: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
          </div>
        </div>
      );
    }

    case "studioIntro": {
      const intro = sections.studioIntro;
      return (
        <div className="flex flex-col gap-6 max-w-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">Studio Manifesto & Metrics</h2>
            <p className="text-xs text-[#90909c] mt-1">
              Introduction statement, studio locations, and architectural performance metrics.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Section Label
            </label>
            <input
              type="text"
              value={intro.label}
              onChange={(e) => updateSection("studioIntro", { label: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Primary Statement Title
            </label>
            <input
              type="text"
              value={intro.title}
              onChange={(e) => updateSection("studioIntro", { title: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Studio Locations String
            </label>
            <input
              type="text"
              value={intro.locations}
              onChange={(e) => updateSection("studioIntro", { locations: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
            />
          </div>

          {/* Description Paragraphs */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#90909c]">
              Body Paragraphs
            </span>
            {intro.descriptionParagraphs.map((para, idx) => (
              <textarea
                key={idx}
                rows={3}
                value={para}
                onChange={(e) => {
                  const updated = [...intro.descriptionParagraphs];
                  updated[idx] = e.target.value;
                  updateSection("studioIntro", { descriptionParagraphs: updated });
                }}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b] resize-none"
              />
            ))}
          </div>

          {/* Stats Manager */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-white">
              Studio Metrics (4 Columns)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {intro.stats.map((st, idx) => (
                <div key={st.id} className="p-3 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-2">
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => {
                      const updated = [...intro.stats];
                      updated[idx] = { ...st, value: e.target.value };
                      updateSection("studioIntro", { stats: updated });
                    }}
                    placeholder="Value (e.g. <140ms)"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const updated = [...intro.stats];
                      updated[idx] = { ...st, label: e.target.value };
                      updateSection("studioIntro", { stats: updated });
                    }}
                    placeholder="Label (e.g. Edge Response)"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "services": {
      const srv = sections.services;
      return (
        <div className="flex flex-col gap-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-bold text-white">Services Bento Grid</h2>
            <p className="text-xs text-[#90909c] mt-1">
              Add, remove, reorder, and configure studio capability entries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={srv.title}
                onChange={(e) => updateSection("services", { title: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Section Subtitle
              </label>
              <input
                type="text"
                value={srv.subtitle}
                onChange={(e) => updateSection("services", { subtitle: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
          </div>

          {/* Service Items List */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <span className="text-xs font-mono uppercase tracking-wider text-white">
              Service Items ({srv.items.length})
            </span>
            <button
              onClick={() => {
                const newItem = {
                  id: `srv-${Date.now()}`,
                  title: "New Studio Service",
                  category: "Specialized",
                  description: "Describe the specific strategic advantage of this discipline.",
                  features: ["Custom feature 1", "Custom feature 2"],
                  icon: "Sparkles",
                };
                updateSection("services", { items: [...srv.items, newItem] });
              }}
              className="text-xs font-mono text-[#c6f36b] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {srv.items.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#585863]">Service 0{idx + 1}</span>
                  <button
                    onClick={() => {
                      const updated = srv.items.filter((_, i) => i !== idx);
                      updateSection("services", { items: updated });
                    }}
                    className="text-[#585863] hover:text-red-400 p-1"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...srv.items];
                      updated[idx] = { ...item, title: e.target.value };
                      updateSection("services", { items: updated });
                    }}
                    placeholder="Title"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => {
                      const updated = [...srv.items];
                      updated[idx] = { ...item, category: e.target.value };
                      updateSection("services", { items: updated });
                    }}
                    placeholder="Category"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...srv.items];
                    updated[idx] = { ...item, description: e.target.value };
                    updateSection("services", { items: updated });
                  }}
                  placeholder="Service description"
                  className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "nfcShowcase": {
      const nfc = sections.nfcShowcase;
      return (
        <div className="flex flex-col gap-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-bold text-white">NFC Hardware Showcase</h2>
            <p className="text-xs text-[#90909c] mt-1">
              Configure aerospace metallic card materials, PVD finishes, and weight specs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={nfc.title}
                onChange={(e) => updateSection("nfcShowcase", { title: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Section Subtitle
              </label>
              <input
                type="text"
                value={nfc.subtitle}
                onChange={(e) => updateSection("nfcShowcase", { subtitle: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
          </div>

          {/* Cards List */}
          <div className="flex flex-col gap-4 pt-4 border-t border-white/[0.08]">
            <span className="text-xs font-mono uppercase tracking-wider text-white">
              Card Material Variants ({nfc.cards.length})
            </span>

            {nfc.cards.map((c, idx) => (
              <div key={c.id} className="p-4 rounded-2xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => {
                      const updated = [...nfc.cards];
                      updated[idx] = { ...c, name: e.target.value };
                      updateSection("nfcShowcase", { cards: updated });
                    }}
                    placeholder="Card Name"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={c.material}
                    onChange={(e) => {
                      const updated = [...nfc.cards];
                      updated[idx] = { ...c, material: e.target.value };
                      updateSection("nfcShowcase", { cards: updated });
                    }}
                    placeholder="Material Alloy"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={c.weight}
                    onChange={(e) => {
                      const updated = [...nfc.cards];
                      updated[idx] = { ...c, weight: e.target.value };
                      updateSection("nfcShowcase", { cards: updated });
                    }}
                    placeholder="Weight (e.g. 24.8g)"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <textarea
                  rows={2}
                  value={c.description}
                  onChange={(e) => {
                    const updated = [...nfc.cards];
                    updated[idx] = { ...c, description: e.target.value };
                    updateSection("nfcShowcase", { cards: updated });
                  }}
                  placeholder="Material description"
                  className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "work": {
      const work = sections.work;
      return (
        <div className="flex flex-col gap-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-bold text-white">Selected Work & Concept Gallery</h2>
            <p className="text-xs text-[#90909c] mt-1">
              Manage portfolio projects. Concept projects must be explicitly marked with the Concept Study toggle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={work.title}
                onChange={(e) => updateSection("work", { title: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Section Subtitle
              </label>
              <input
                type="text"
                value={work.subtitle}
                onChange={(e) => updateSection("work", { subtitle: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
          </div>

          {/* Add Project Button */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <span className="text-xs font-mono uppercase tracking-wider text-white">
              Projects ({work.projects.length})
            </span>
            <button
              onClick={() => {
                const newProj = {
                  id: `proj-${Date.now()}`,
                  title: "New Studio Case Study",
                  category: "Web Platform",
                  description: "Comprehensive case study on identity design and edge performance.",
                  image: "/images/nfccard.webp",
                  link: "#contact",
                  isConcept: true,
                  deliverables: ["Next.js Architecture", "Tailwind Theme"],
                  year: "2026",
                };
                updateSection("work", { projects: [...work.projects, newProj] });
              }}
              className="text-xs font-mono text-[#c6f36b] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {work.projects.map((proj, idx) => (
              <div key={proj.id} className="p-5 rounded-2xl bg-[#121215] border border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#585863]">Project 0{idx + 1}</span>
                  <div className="flex items-center gap-3">
                    {/* Concept Toggle */}
                    <button
                      onClick={() => {
                        const updated = [...work.projects];
                        updated[idx] = { ...proj, isConcept: !proj.isConcept };
                        updateSection("work", { projects: updated });
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
                        proj.isConcept
                          ? "bg-[#c6f36b]/20 border-[#c6f36b] text-[#c6f36b]"
                          : "bg-white/[0.04] border-white/10 text-[#90909c]"
                      }`}
                    >
                      {proj.isConcept ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      <span>Concept Study</span>
                    </button>

                    <button
                      onClick={() => {
                        const updated = work.projects.filter((_, i) => i !== idx);
                        updateSection("work", { projects: updated });
                      }}
                      className="text-[#585863] hover:text-red-400 p-1"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...work.projects];
                      updated[idx] = { ...proj, title: e.target.value };
                      updateSection("work", { projects: updated });
                    }}
                    placeholder="Project Title"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={proj.category}
                    onChange={(e) => {
                      const updated = [...work.projects];
                      updated[idx] = { ...proj, category: e.target.value };
                      updateSection("work", { projects: updated });
                    }}
                    placeholder="Category"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={proj.year}
                    onChange={(e) => {
                      const updated = [...work.projects];
                      updated[idx] = { ...proj, year: e.target.value };
                      updateSection("work", { projects: updated });
                    }}
                    placeholder="Year"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => {
                    const updated = [...work.projects];
                    updated[idx] = { ...proj, description: e.target.value };
                    updateSection("work", { projects: updated });
                  }}
                  placeholder="Case study summary"
                  className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
                />

                <MediaUploader
                  label="Project Showcase Image"
                  currentUrl={proj.image}
                  onUrlChange={(url) => {
                    const updated = [...work.projects];
                    updated[idx] = { ...proj, image: url };
                    updateSection("work", { projects: updated });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "testimonials": {
      const test = sections.testimonials;
      return (
        <div className="flex flex-col gap-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-bold text-white">Testimonials & Client Endorsements</h2>
            <p className="text-xs text-[#90909c] mt-1">
              Manage client quotes. By requirement, quotes remain hidden until explicitly approved.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={test.title}
                onChange={(e) => updateSection("testimonials", { title: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
                Section Subtitle
              </label>
              <input
                type="text"
                value={test.subtitle}
                onChange={(e) => updateSection("testimonials", { subtitle: e.target.value })}
                className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
              />
            </div>
          </div>

          {/* Items */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <span className="text-xs font-mono uppercase tracking-wider text-white">
              Endorsements ({test.items.length})
            </span>
            <button
              onClick={() => {
                const newItem = {
                  id: `test-${Date.now()}`,
                  author: "Alexander Mercer",
                  role: "Managing Director",
                  company: "Mercer Holdings",
                  avatarText: "AM",
                  quote: "UIC delivered exceptional quality on both hardware and digital architecture.",
                  approved: false, // Hidden until explicitly approved!
                };
                updateSection("testimonials", { items: [...test.items, newItem] });
              }}
              className="text-xs font-mono text-[#c6f36b] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Endorsement</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {test.items.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#585863]">Item 0{idx + 1}</span>

                  <div className="flex items-center gap-3">
                    {/* Approved Toggle */}
                    <button
                      onClick={() => {
                        const updated = [...test.items];
                        updated[idx] = { ...item, approved: !item.approved };
                        updateSection("testimonials", { items: updated });
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
                        item.approved
                          ? "bg-[#c6f36b]/20 border-[#c6f36b] text-[#c6f36b]"
                          : "bg-white/[0.04] border-white/10 text-[#90909c]"
                      }`}
                    >
                      {item.approved ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      <span>{item.approved ? "Approved & Visible" : "Pending / Hidden"}</span>
                    </button>

                    <button
                      onClick={() => {
                        const updated = test.items.filter((_, i) => i !== idx);
                        updateSection("testimonials", { items: updated });
                      }}
                      className="text-[#585863] hover:text-red-400 p-1"
                      title="Delete quote"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={item.author}
                    onChange={(e) => {
                      const updated = [...test.items];
                      updated[idx] = { ...item, author: e.target.value };
                      updateSection("testimonials", { items: updated });
                    }}
                    placeholder="Author Name"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => {
                      const updated = [...test.items];
                      updated[idx] = { ...item, role: e.target.value };
                      updateSection("testimonials", { items: updated });
                    }}
                    placeholder="Role"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => {
                      const updated = [...test.items];
                      updated[idx] = { ...item, company: e.target.value };
                      updateSection("testimonials", { items: updated });
                    }}
                    placeholder="Company"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <textarea
                  rows={2}
                  value={item.quote}
                  onChange={(e) => {
                    const updated = [...test.items];
                    updated[idx] = { ...item, quote: e.target.value };
                    updateSection("testimonials", { items: updated });
                  }}
                  placeholder="Client quote"
                  className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "faq": {
      const faq = sections.faq;
      return (
        <div className="flex flex-col gap-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-bold text-white">FAQ Accordion</h2>
            <p className="text-xs text-[#90909c] mt-1">
              Add and edit answers to common client questions regarding hardware and hosting.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <span className="text-xs font-mono uppercase tracking-wider text-white">
              Questions ({faq.items.length})
            </span>
            <button
              onClick={() => {
                const newItem = {
                  id: `faq-${Date.now()}`,
                  question: "New Frequently Asked Question?",
                  answer: "Clear, detailed response addressing client questions directly.",
                  category: "General",
                };
                updateSection("faq", { items: [...faq.items, newItem] });
              }}
              className="text-xs font-mono text-[#c6f36b] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {faq.items.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const updated = [...faq.items];
                      updated[idx] = { ...item, question: e.target.value };
                      updateSection("faq", { items: updated });
                    }}
                    placeholder="Question"
                    className="flex-1 bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white mr-3 font-medium"
                  />
                  <button
                    onClick={() => {
                      const updated = faq.items.filter((_, i) => i !== idx);
                      updateSection("faq", { items: updated });
                    }}
                    className="text-[#585863] hover:text-red-400 p-1"
                    title="Delete question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={item.answer}
                  onChange={(e) => {
                    const updated = [...faq.items];
                    updated[idx] = { ...item, answer: e.target.value };
                    updateSection("faq", { items: updated });
                  }}
                  placeholder="Answer"
                  className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "contact": {
      const contact = sections.contact;
      return (
        <div className="flex flex-col gap-6 max-w-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">Contact & Commission CTA</h2>
            <p className="text-xs text-[#90909c] mt-1">
              Studio contact email, response timeline notice, and commission availability badge.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Direct Contact Email (Triggers Mailto and Copy)
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => updateSection("contact", { email: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Availability Status Badge
            </label>
            <input
              type="text"
              value={contact.availabilityStatus}
              onChange={(e) => updateSection("contact", { availabilityStatus: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-1.5">
              Response Time Notice
            </label>
            <input
              type="text"
              value={contact.responseTimeNotice}
              onChange={(e) => updateSection("contact", { responseTimeNotice: e.target.value })}
              className="w-full bg-[#161619] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f36b]"
            />
          </div>
        </div>
      );
    }

    case "process": {
      const proc = sections.process;
      return (
        <div className="flex flex-col gap-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-bold text-white">Process Methodology</h2>
            <p className="text-xs text-[#90909c] mt-1">
              Configure the 4 strategic phases from brand audit to hardware delivery.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {proc.steps.map((st, idx) => (
              <div key={st.id} className="p-4 rounded-2xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={st.stepNumber}
                    onChange={(e) => {
                      const updated = [...proc.steps];
                      updated[idx] = { ...st, stepNumber: e.target.value };
                      updateSection("process", { steps: updated });
                    }}
                    placeholder="Step Number"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => {
                      const updated = [...proc.steps];
                      updated[idx] = { ...st, title: e.target.value };
                      updateSection("process", { steps: updated });
                    }}
                    placeholder="Title"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={st.duration || ""}
                    onChange={(e) => {
                      const updated = [...proc.steps];
                      updated[idx] = { ...st, duration: e.target.value };
                      updateSection("process", { steps: updated });
                    }}
                    placeholder="Duration (e.g. Phase 1 • Week 1)"
                    className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <textarea
                  rows={2}
                  value={st.description}
                  onChange={(e) => {
                    const updated = [...proc.steps];
                    updated[idx] = { ...st, description: e.target.value };
                    updateSection("process", { steps: updated });
                  }}
                  placeholder="Phase methodology details"
                  className="bg-[#18181d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="p-6 text-sm text-[#90909c]">
          Select a section from the sidebar to inspect and customize its parameters.
        </div>
      );
  }
};
