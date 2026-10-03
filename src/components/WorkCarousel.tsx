"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { WorkCarouselSectionContent, ProjectItem } from "@/types/content";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowUpRight,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

interface WorkCarouselProps {
  content: WorkCarouselSectionContent;
  accentColor?: string;
  onOpenInquiry?: () => void;
}

export const WorkCarousel: React.FC<WorkCarouselProps> = ({
  content,
  accentColor = "#c6f36b",
  onOpenInquiry,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(content.autoplay ?? true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Touch / drag tracking
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const projects = content.projects || [];

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const total = filteredProjects.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Handle Autoplay
  useEffect(() => {
    if (!isPlaying || isHovered || total <= 1) return;
    const intervalTime = content.autoplayInterval || 4500;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, total, nextSlide, content.autoplayInterval]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  if (!content.enabled || projects.length === 0) {
    return null;
  }

  const currentProject = filteredProjects[currentIndex] || filteredProjects[0];

  return (
    <section
      id="work-carousel"
      className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-zinc-200 dark:border-white/[0.06] bg-[var(--bg-primary)]/80 dark:bg-[var(--bg-primary)] backdrop-blur-xs transition-colors duration-300 overflow-hidden"
    >
      {/* Decorative Rotating Geometric Wireframe Behind Carousel */}
      <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-96 h-96 pointer-events-none opacity-25 dark:opacity-10 animate-spin-slow">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <polygon points="100,10 190,160 10,160" stroke="url(#carouselWireGrad)" strokeWidth="1.2" strokeDasharray="8 6" />
          <circle cx="100" cy="110" r="55" stroke="url(#carouselWireGrad)" strokeWidth="1" />
          <defs>
            <linearGradient id="carouselWireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
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
                {content.label || "Featured Work Showcase"}
              </span>
              <span className="text-xs font-mono text-zinc-400 dark:text-[#585863]">
                / Carousel
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-zinc-950 dark:text-[#f5f5f7]">
              {content.title || "Selected Works in Motion"}
            </h2>
          </div>

          {/* Carousel Controls (Top Right Desktop) */}
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-full bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-white/20 text-zinc-700 dark:text-[#90909c] hover:text-zinc-950 dark:hover:text-white transition-colors shadow-2xs"
              title={isPlaying ? "Pause Autoplay" : "Resume Autoplay"}
              aria-label={isPlaying ? "Pause Autoplay" : "Resume Autoplay"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Slide Index Counter */}
            <div className="px-4 py-2 rounded-full bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 font-mono text-xs text-zinc-700 dark:text-[#90909c] font-medium shadow-2xs">
              <span className="text-zinc-950 dark:text-white font-bold">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="mx-1 text-zinc-400 dark:text-[#585863]">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-full bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-white/20 text-zinc-700 dark:text-[#90909c] hover:text-zinc-950 dark:hover:text-white transition-all hover:scale-105 active:scale-95 shadow-2xs"
                title="Previous Project"
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                className="p-2.5 rounded-full bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-white/20 text-zinc-700 dark:text-[#90909c] hover:text-zinc-950 dark:hover:text-white transition-all hover:scale-105 active:scale-95 shadow-2xs"
                title="Next Project"
                aria-label="Next Project"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
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

        {/* ========================================================================= */}
        {/* CAROUSEL STAGE CONTAINER */}
        {/* ========================================================================= */}
        {total > 0 && currentProject && (
          <div
            className="group relative rounded-3xl bg-white/95 dark:bg-[#0d0d10] border border-zinc-200/90 dark:border-white/[0.08] p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(99,102,241,0.12)] dark:shadow-2xl overflow-hidden transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* LEFT: Project Preview Visual */}
              <div
                className="lg:col-span-7 relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-[#141418] border border-zinc-200 dark:border-white/10 cursor-pointer shadow-md group-hover:shadow-xl transition-all"
                onClick={() => setSelectedProject(currentProject)}
              >
                <Image
                  src={currentProject.image}
                  alt={currentProject.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />

                {/* Concept Tag */}
                {currentProject.isConcept && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-950 bg-[#c6f36b] px-3 py-1 rounded-full font-bold shadow-md">
                      Concept Study
                    </span>
                  </div>
                )}

                {/* Year Pill */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-[10px] font-mono text-zinc-800 dark:text-white/90 bg-white/90 dark:bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-200 dark:border-white/10 font-semibold">
                    {currentProject.year}
                  </span>
                </div>

                {/* Hover Clickable Overlay */}
                <div className="absolute inset-0 bg-black/30 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-xl">
                    <span>Inspect Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* RIGHT: Editorial Project Details */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  {/* Category Pill */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-[#c6f36b] bg-indigo-50 dark:bg-[#c6f36b]/10 border border-indigo-200 dark:border-[#c6f36b]/20 px-3 py-1 rounded-full font-semibold">
                      {currentProject.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 dark:text-[#585863]">
                      Archive {currentProject.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-4xl font-medium tracking-tight text-zinc-950 dark:text-white mb-4">
                    {currentProject.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-[#90909c] leading-relaxed font-light mb-6">
                    {currentProject.description}
                  </p>

                  {/* Deliverables Pills */}
                  {currentProject.deliverables && currentProject.deliverables.length > 0 && (
                    <div className="mb-8">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-[#90909c] block mb-2.5 font-medium">
                        Architectural Deliverables:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentProject.deliverables.map((del, dIdx) => (
                          <span
                            key={dIdx}
                            className="px-3 py-1 rounded-full text-[11px] font-mono bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-zinc-800 dark:text-white font-medium"
                          >
                            {del}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-6 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between gap-4">
                  <button
                    onClick={() => setSelectedProject(currentProject)}
                    className="px-6 py-3 rounded-full bg-[#c6f36b] hover:bg-[#b5e656] text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95"
                  >
                    <span>Full Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {onOpenInquiry && (
                    <button
                      onClick={onOpenInquiry}
                      className="text-xs font-mono text-zinc-500 dark:text-[#90909c] hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center gap-1 font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#c6f36b]" />
                      <span>Commission Similar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Carousel Step Dots (Bottom Bar) */}
            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {filteredProjects.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentIndex === dotIdx
                        ? "w-8 bg-indigo-600 dark:bg-[#c6f36b]"
                        : "w-2 bg-zinc-300 dark:bg-white/20 hover:bg-zinc-400 dark:hover:bg-white/40"
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <span className="text-[11px] font-mono text-zinc-400 dark:text-[#585863]">
                SWIPE OR USE ARROWS TO BROWSE
              </span>
            </div>
          </div>
        )}

        {/* Modal Inspector */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#0f0f12] border border-zinc-200 dark:border-white/10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto flex flex-col gap-6 shadow-2xl">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-[#90909c] hover:text-zinc-950 dark:hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-[#c6f36b] font-semibold">
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
