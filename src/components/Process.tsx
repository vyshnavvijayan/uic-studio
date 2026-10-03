"use client";

import React from "react";
import { ProcessSectionContent } from "@/types/content";

interface ProcessProps {
  content: ProcessSectionContent;
  accentColor?: string;
}

const stepThemes = [
  {
    numColor: "text-indigo-600 dark:text-white/40",
    badge: "text-indigo-700 bg-indigo-50 border-indigo-200/80",
    borderHover: "hover:border-indigo-300 dark:hover:border-white/20",
    glow: "hover:shadow-[0_12px_36px_-6px_rgba(99,102,241,0.18)] dark:hover:shadow-none",
    tagColor: "text-indigo-600 dark:text-[#c6f36b]",
  },
  {
    numColor: "text-cyan-600 dark:text-white/40",
    badge: "text-cyan-700 bg-cyan-50 border-cyan-200/80",
    borderHover: "hover:border-cyan-300 dark:hover:border-white/20",
    glow: "hover:shadow-[0_12px_36px_-6px_rgba(6,182,212,0.18)] dark:hover:shadow-none",
    tagColor: "text-cyan-600 dark:text-[#c6f36b]",
  },
  {
    numColor: "text-emerald-600 dark:text-white/40",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
    borderHover: "hover:border-emerald-300 dark:hover:border-white/20",
    glow: "hover:shadow-[0_12px_36px_-6px_rgba(16,185,129,0.18)] dark:hover:shadow-none",
    tagColor: "text-emerald-600 dark:text-[#c6f36b]",
  },
  {
    numColor: "text-amber-600 dark:text-white/40",
    badge: "text-amber-800 bg-amber-50 border-amber-200/80",
    borderHover: "hover:border-amber-300 dark:hover:border-white/20",
    glow: "hover:shadow-[0_12px_36px_-6px_rgba(245,158,11,0.18)] dark:hover:shadow-none",
    tagColor: "text-amber-600 dark:text-[#c6f36b]",
  },
];

export const Process: React.FC<ProcessProps> = ({
  content,
  accentColor = "#c6f36b",
}) => {
  return (
    <section
      id="process"
      className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-zinc-200 dark:border-white/[0.06] bg-[var(--bg-primary)]/80 dark:bg-[var(--bg-primary)] backdrop-blur-xs transition-colors duration-300 overflow-hidden"
    >
      {/* Decorative Rotating Geometric Accents */}
      <div className="absolute top-12 right-[8%] w-64 h-64 pointer-events-none opacity-30 dark:opacity-10 animate-spin-slow">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <circle cx="100" cy="100" r="85" stroke="url(#processGrad)" strokeWidth="1" strokeDasharray="14 6" />
          <polygon points="100,25 175,155 25,155" stroke="url(#processGrad)" strokeWidth="1" />
          <defs>
            <linearGradient id="processGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-24">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: accentColor }} />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-[#90909c] font-medium">
                {content.label || "Methodology"}
              </span>
              <span className="text-xs font-mono text-zinc-400 dark:text-[#585863]">/ 05</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-zinc-950 dark:text-[#f5f5f7]">
              {content.title}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-[#90909c] max-w-md font-light">
            {content.subtitle}
          </p>
        </div>

        {/* Process Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {content.steps.map((step, idx) => {
            const theme = stepThemes[idx % stepThemes.length];
            return (
              <div
                key={step.id}
                className={`relative p-8 rounded-2xl bg-white/95 dark:bg-[#0d0d10] border border-zinc-200/90 dark:border-white/[0.06] transition-all duration-300 flex flex-col justify-between shadow-sm dark:shadow-none overflow-hidden ${theme.borderHover} ${theme.glow}`}
              >
                {/* Step Top Bar */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className={`text-3xl sm:text-4xl font-mono font-bold transition-colors ${theme.numColor}`}>
                      {step.stepNumber}
                    </span>
                    {step.duration && (
                      <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border font-semibold ${theme.badge} dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-[#90909c]`}>
                        {step.duration}
                      </span>
                    )}
                  </div>

                  <span className={`text-xs font-mono uppercase tracking-widest font-semibold block mb-2 ${theme.tagColor}`}>
                    {step.subtitle}
                  </span>

                  <h3 className="text-xl font-medium text-zinc-950 dark:text-white tracking-tight mb-4">
                    {step.title}
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-[#90909c] leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-400 dark:text-[#585863]">
                  <span>STAGE 0{idx + 1}</span>
                  <span>VERIFIED PROTOCOL</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
