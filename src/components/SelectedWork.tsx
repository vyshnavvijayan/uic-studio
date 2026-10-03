"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WorkSectionContent, ProjectItem } from "@/types/content";
import { ArrowUpRight, X } from "lucide-react";

interface SelectedWorkProps {
  content: WorkSectionContent;
  accentColor?: string;
  onOpenInquiry?: () => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  content,
  accentColor = "#c6f36b",
  onOpenInquiry,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories = [
    "All",
    ...Array.from(new Set(content.projects.map((p) => p.category))),
  ];

  const filteredProjects =
    activeCategory === "All"
      ? content.projects
      : content.projects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="work"
      className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-zinc-200 dark:border-white/[0.06] bg-[var(--bg-primary)]/80 dark:bg-[var(--bg-primary)] backdrop-blur-xs transition-colors duration-300 overflow-hidden"
    >
      {/* Decorative Rotating Geometric Accents */}
      <div className="absolute top-1/3 -left-16 w-60 h-60 pointer-events-none opacity-30 dark:opacity-10 animate-float-slow">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full animate-spin-slow">
          <polygon points="100,10 190,160 10,160" stroke="url(#workGrad)" strokeWidth="1.2" strokeDasharray="8 6" />
          <circle cx="100" cy="110" r="50" stroke="url(#workGrad)" strokeWidth="1" />
          <defs>
            <linearGradient id="workGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: accentColor }} />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-[#90909c] font-medium">
                {content.label || "Selected Work"}
              </span>
              <span className="text-xs font-mono text-zinc-400 dark:text-[#585863]">/ 04</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-zinc-950 dark:text-[#f5f5f7]">
              {content.title}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-[#90909c] max-w-md font-light">
            {content.subtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap border ${
                activeCategory === cat
                  ? "bg-zinc-950 dark:bg-white text-white dark:text-[#080809] border-zinc-950 dark:border-white font-medium shadow-md"
                  : "bg-white/90 dark:bg-white/[0.02] border-zinc-200/90 dark:border-white/[0.08] text-zinc-600 dark:text-[#90909c] hover:border-indigo-300 dark:hover:border-white/20 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-[#121215] border border-zinc-200/90 dark:border-white/[0.08] mb-5 group-hover:border-indigo-300/80 dark:group-hover:border-white/20 group-hover:shadow-[0_16px_36px_-8px_rgba(99,102,241,0.18)] dark:group-hover:shadow-none transition-all duration-300 shadow-sm">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Concept Tag */}
                {project.isConcept && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-950 bg-[#c6f36b] px-2.5 py-1 rounded-full font-semibold shadow-md">
                      Concept Study
                    </span>
                  </div>
                )}

                {/* Year Pill */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-[10px] font-mono text-zinc-800 dark:text-white/80 bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-zinc-200 dark:border-white/10 font-medium">
                    {project.year}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/30 dark:bg-[#080809]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-lg">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-600 dark:text-[#90909c] block mb-1 font-medium">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-medium text-zinc-950 dark:text-[#f5f5f7] group-hover:text-black dark:group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-400 dark:text-[#585863] group-hover:text-indigo-600 dark:group-hover:text-[#c6f36b] transition-colors pt-1">
                  ↗
                </span>
              </div>

              <p className="mt-2 text-xs text-zinc-600 dark:text-[#90909c] line-clamp-2 font-light">
                {project.description}
              </p>
            </div>
          ))}
        </div>

        {/* Project Inspector Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#0f0f12] border border-zinc-200 dark:border-white/10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto flex flex-col gap-6 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-[#90909c] hover:text-zinc-950 dark:hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Modal Details */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-[#c6f36b] font-semibold">
                    {selectedProject.category}
                  </span>
                  {selectedProject.isConcept && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-950 bg-[#c6f36b] px-2 py-0.5 rounded font-semibold">
                      Concept Study
                    </span>
                  )}
                  <span className="text-xs font-mono text-zinc-400 dark:text-[#585863]">
                    • {selectedProject.year}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-medium text-zinc-950 dark:text-white">
                  {selectedProject.title}
                </h3>

                <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-[#90909c] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Deliverables */}
              {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
                <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.08]">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-[#90909c] block mb-3 font-medium">
                    Project Deliverables:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.deliverables.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-zinc-800 dark:text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.08] flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    onOpenInquiry?.();
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#c6f36b] text-zinc-950 hover:bg-[#b5e656] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Commission Similar Project
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-xs font-mono text-zinc-500 dark:text-[#90909c] hover:text-zinc-950 dark:hover:text-white"
                >
                  Close [ESC]
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
