"use client";

import React, { useState } from "react";
import { ServicesSectionContent } from "@/types/content";
import { Sparkles, Layers, Cpu, Zap, Sliders, Code, ChevronRight, Check } from "lucide-react";

interface ServicesProps {
  content: ServicesSectionContent;
  accentColor?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Layers,
  Cpu,
  Zap,
  Sliders,
  Code,
};

const serviceThemes = [
  {
    categoryLight: "bg-indigo-50 border-indigo-200/80 text-indigo-700",
    iconBoxLight: "bg-indigo-50/80 border-indigo-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    hoverBorderLight: "hover:border-indigo-300",
    hoverGlowLight: "hover:shadow-[0_12px_36px_-6px_rgba(99,102,241,0.18)]",
    expandedBorder: "border-indigo-500/60 dark:border-[#c6f36b]/40 shadow-xl",
    specColor: "text-indigo-600 dark:text-[#c6f36b]",
  },
  {
    categoryLight: "bg-cyan-50 border-cyan-200/80 text-cyan-700",
    iconBoxLight: "bg-cyan-50/80 border-cyan-200 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white",
    hoverBorderLight: "hover:border-cyan-300",
    hoverGlowLight: "hover:shadow-[0_12px_36px_-6px_rgba(6,182,212,0.18)]",
    expandedBorder: "border-cyan-500/60 dark:border-[#c6f36b]/40 shadow-xl",
    specColor: "text-cyan-600 dark:text-[#c6f36b]",
  },
  {
    categoryLight: "bg-emerald-50 border-emerald-200/80 text-emerald-700",
    iconBoxLight: "bg-emerald-50/80 border-emerald-200 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    hoverBorderLight: "hover:border-emerald-300",
    hoverGlowLight: "hover:shadow-[0_12px_36px_-6px_rgba(16,185,129,0.18)]",
    expandedBorder: "border-emerald-500/60 dark:border-[#c6f36b]/40 shadow-xl",
    specColor: "text-emerald-600 dark:text-[#c6f36b]",
  },
  {
    categoryLight: "bg-amber-50 border-amber-200/80 text-amber-800",
    iconBoxLight: "bg-amber-50/80 border-amber-200 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
    hoverBorderLight: "hover:border-amber-300",
    hoverGlowLight: "hover:shadow-[0_12px_36px_-6px_rgba(245,158,11,0.18)]",
    expandedBorder: "border-amber-500/60 dark:border-[#c6f36b]/40 shadow-xl",
    specColor: "text-amber-600 dark:text-[#c6f36b]",
  },
  {
    categoryLight: "bg-purple-50 border-purple-200/80 text-purple-700",
    iconBoxLight: "bg-purple-50/80 border-purple-200 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    hoverBorderLight: "hover:border-purple-300",
    hoverGlowLight: "hover:shadow-[0_12px_36px_-6px_rgba(168,85,247,0.18)]",
    expandedBorder: "border-purple-500/60 dark:border-[#c6f36b]/40 shadow-xl",
    specColor: "text-purple-600 dark:text-[#c6f36b]",
  },
  {
    categoryLight: "bg-rose-50 border-rose-200/80 text-rose-700",
    iconBoxLight: "bg-rose-50/80 border-rose-200 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
    hoverBorderLight: "hover:border-rose-300",
    hoverGlowLight: "hover:shadow-[0_12px_36px_-6px_rgba(244,63,94,0.18)]",
    expandedBorder: "border-rose-500/60 dark:border-[#c6f36b]/40 shadow-xl",
    specColor: "text-rose-600 dark:text-[#c6f36b]",
  },
];

export const Services: React.FC<ServicesProps> = ({
  content,
  accentColor = "#c6f36b",
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="services"
      className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-zinc-200 dark:border-white/[0.06] bg-[var(--bg-primary)]/80 dark:bg-[var(--bg-primary)] backdrop-blur-xs transition-colors duration-300 overflow-hidden"
    >
      {/* Decorative Rotating Geometric Wireframe Behind Header */}
      <div className="absolute top-10 right-[15%] w-72 h-72 pointer-events-none opacity-30 dark:opacity-10 animate-spin-reverse-slow">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <circle cx="100" cy="100" r="90" stroke="url(#servicesGrad)" strokeWidth="1" strokeDasharray="10 8" />
          <circle cx="100" cy="100" r="60" stroke="url(#servicesGrad)" strokeWidth="1.2" />
          <rect x="65" y="65" width="70" height="70" stroke="url(#servicesGrad)" strokeWidth="1" transform="rotate(45 100 100)" />
          <defs>
            <linearGradient id="servicesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: accentColor }} />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-[#90909c] font-medium">
                {content.label || "Studio Capabilities"}
              </span>
              <span className="text-xs font-mono text-zinc-400 dark:text-[#585863]">/ 02</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-zinc-950 dark:text-[#f5f5f7]">
              {content.title}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-[#90909c] max-w-md font-light">
            {content.subtitle}
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((service, idx) => {
            const Icon = iconMap[service.icon] || Sparkles;
            const isExpanded = expandedId === service.id;
            const theme = serviceThemes[idx % serviceThemes.length];

            return (
              <div
                key={service.id}
                onClick={() => toggleExpand(service.id)}
                className={`group relative rounded-2xl border transition-all duration-300 p-8 flex flex-col justify-between cursor-pointer overflow-hidden ${
                  isExpanded
                    ? `bg-white dark:bg-[#121215] ${theme.expandedBorder}`
                    : `bg-white/95 dark:bg-[#0d0d10] border-zinc-200/90 dark:border-white/[0.06] ${theme.hoverBorderLight} dark:hover:border-white/20 hover:bg-white dark:hover:bg-[#101013] shadow-sm dark:shadow-none ${theme.hoverGlowLight}`
                }`}
              >
                <div>
                  {/* Top Bar: Category & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest border px-3 py-1 rounded-full font-semibold transition-colors ${theme.categoryLight} dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-[#90909c]`}
                    >
                      {service.category}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-2xs ${theme.iconBoxLight} dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white dark:group-hover:text-[#c6f36b]`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mb-4">
                    <span className="text-xs font-mono text-zinc-400 dark:text-[#585863] block mb-2 font-medium">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-medium text-zinc-950 dark:text-[#f5f5f7] tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-[#90909c] leading-relaxed font-light mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Features Inspection */}
                <div>
                  {isExpanded && (
                    <div className="pt-4 border-t border-zinc-200 dark:border-white/[0.06] mb-4 flex flex-col gap-2 animate-in fade-in duration-200">
                      <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${theme.specColor}`}>
                        Technical Specifications:
                      </span>
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-[#90909c]">
                          <Check className={`w-3.5 h-3.5 flex-shrink-0 ${theme.specColor}`} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-[#90909c] pt-2 border-t border-zinc-100 dark:border-transparent">
                    <span className="text-[11px] uppercase tracking-wider group-hover:text-zinc-950 dark:group-hover:text-white transition-colors font-medium">
                      {isExpanded ? "Collapse Specs" : "Inspect Parameters"}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-zinc-400 dark:text-[#90909c] group-hover:text-zinc-950 dark:group-hover:text-white transition-transform ${
                        isExpanded ? `rotate-90 ${theme.specColor}` : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
