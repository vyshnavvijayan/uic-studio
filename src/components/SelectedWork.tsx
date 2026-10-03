"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WorkSectionContent, ProjectItem } from "@/types/content";
import { ArrowUpRight, X, ExternalLink } from "lucide-react";

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
    <section id="work" className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-white/[0.06] bg-[#080809]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <span className="text-xs font-mono uppercase tracking-widest text-[#90909c]">
                {content.label || "Selected Work"}
              </span>
              <span className="text-xs font-mono text-[#585863]">/ 04</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#f5f5f7]">
              {content.title}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#90909c] max-w-md font-light">
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
                  ? "bg-white text-[#080809] border-white font-medium"
                  : "bg-white/[0.02] border-white/[0.08] text-[#90909c] hover:border-white/20 hover:text-white"
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
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-[#121215] border border-white/[0.08] mb-5 group-hover:border-white/20 transition-all duration-300">
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
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#080809] bg-[#c6f36b] px-2.5 py-1 rounded-full font-semibold shadow-md">
                      Concept Study
                    </span>
                  </div>
                )}

                {/* Year Pill */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-[10px] font-mono text-white/80 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                    {project.year}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#080809]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white text-[#080809] flex items-center justify-center transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#90909c] block mb-1">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-medium text-[#f5f5f7] group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#585863] group-hover:text-[#c6f36b] transition-colors pt-1">
                  ↗
                </span>
              </div>

              <p className="mt-2 text-xs text-[#90909c] line-clamp-2 font-light">
                {project.description}
              </p>
            </div>
          ))}
        </div>

        {/* Project Inspector Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl rounded-3xl bg-[#0f0f12] border border-white/10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto flex flex-col gap-6">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-[#90909c] hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10">
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
                  <span className="text-xs font-mono uppercase tracking-widest text-[#c6f36b]">
                    {selectedProject.category}
                  </span>
                  {selectedProject.isConcept && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-black bg-[#c6f36b] px-2 py-0.5 rounded font-semibold">
                      Concept Study
                    </span>
                  )}
                  <span className="text-xs font-mono text-[#585863]">
                    • {selectedProject.year}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-medium text-white">
                  {selectedProject.title}
                </h3>

                <p className="mt-4 text-sm sm:text-base text-[#90909c] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Deliverables */}
              {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
                <div className="pt-4 border-t border-white/[0.08]">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#90909c] block mb-3">
                    Project Deliverables:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.deliverables.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    onOpenInquiry?.();
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#c6f36b] text-[#080809] hover:bg-[#b5e656] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Commission Similar Project
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-xs font-mono text-[#90909c] hover:text-white"
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
