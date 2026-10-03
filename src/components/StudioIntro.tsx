"use client";

import React from "react";
import { StudioIntroSectionContent } from "@/types/content";

interface StudioIntroProps {
  content: StudioIntroSectionContent;
  accentColor?: string;
}

export const StudioIntro: React.FC<StudioIntroProps> = ({
  content,
  accentColor = "#c6f36b",
}) => {
  const statThemes = [
    {
      bar: "from-indigo-500 to-violet-500",
      hoverBorder: "hover:border-indigo-300 dark:hover:border-white/20",
      glow: "hover:shadow-[0_10px_30px_-5px_rgba(99,102,241,0.18)] dark:hover:shadow-none",
      textAcc: "group-hover:text-indigo-600 dark:group-hover:text-[#c6f36b]",
    },
    {
      bar: "from-cyan-500 to-teal-500",
      hoverBorder: "hover:border-cyan-300 dark:hover:border-white/20",
      glow: "hover:shadow-[0_10px_30px_-5px_rgba(6,182,212,0.18)] dark:hover:shadow-none",
      textAcc: "group-hover:text-cyan-600 dark:group-hover:text-[#c6f36b]",
    },
    {
      bar: "from-emerald-500 to-lime-500",
      hoverBorder: "hover:border-emerald-300 dark:hover:border-white/20",
      glow: "hover:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.18)] dark:hover:shadow-none",
      textAcc: "group-hover:text-emerald-600 dark:group-hover:text-[#c6f36b]",
    },
    {
      bar: "from-amber-500 to-rose-500",
      hoverBorder: "hover:border-amber-300 dark:hover:border-white/20",
      glow: "hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.18)] dark:hover:shadow-none",
      textAcc: "group-hover:text-amber-600 dark:group-hover:text-[#c6f36b]",
    },
  ];

  return (
    <section
      id="studio"
      className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-zinc-200 dark:border-white/[0.06] bg-[var(--bg-primary)]/80 dark:bg-[var(--bg-primary)] backdrop-blur-xs transition-colors duration-300 overflow-hidden"
    >
      {/* Decorative Floating SVG Geometric Shape (Section-anchored) */}
      <div className="absolute -top-12 -right-12 w-64 h-64 pointer-events-none opacity-40 dark:opacity-15 animate-spin-slow">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <circle cx="100" cy="100" r="80" stroke="url(#studioCircleGrad)" strokeWidth="1" strokeDasharray="8 6" />
          <polygon points="100,20 180,140 20,140" stroke="url(#studioCircleGrad)" strokeWidth="1" />
          <defs>
            <linearGradient id="studioCircleGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-10">
          <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: accentColor }} />
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-[#90909c] font-medium">
            {content.label || "Unique Identity Creation"}
          </span>
          <span className="text-xs font-mono text-zinc-400 dark:text-[#585863]">/ 01</span>
        </div>

        {/* Big Editorial Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-950 dark:text-[#f5f5f7] leading-[1.12]">
              {content.title}
            </h2>
            <div className="mt-8 flex items-center gap-3 text-xs font-mono tracking-widest text-zinc-600 dark:text-[#90909c]">
              <span className="text-emerald-600 dark:text-[#c6f36b] animate-pulse">●</span>
              <span className="font-medium">{content.locations}</span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6 text-zinc-600 dark:text-[#90909c] text-base sm:text-lg leading-relaxed font-light">
            {content.descriptionParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Architectural Stats Grid with Colorful Accents */}
        <div className="mt-20 pt-16 border-t border-zinc-200 dark:border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {content.stats.map((stat, idx) => {
            const theme = statThemes[idx % statThemes.length];
            return (
              <div
                key={stat.id}
                className={`group relative flex flex-col gap-1.5 p-6 rounded-2xl bg-white/90 dark:bg-white/[0.02] border border-zinc-200/80 dark:border-white/[0.04] shadow-sm transition-all duration-300 overflow-hidden ${theme.hoverBorder} ${theme.glow}`}
              >
                {/* Top Glowing Color Accent Bar */}
                <div
                  className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${theme.bar} opacity-70 group-hover:opacity-100 transition-opacity`}
                />

                <span
                  className={`text-3xl sm:text-5xl font-mono font-bold tracking-tight text-zinc-950 dark:text-[#f5f5f7] transition-colors ${theme.textAcc}`}
                >
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-800 dark:text-white mt-1">
                  {stat.label}
                </span>
                {stat.sublabel && (
                  <span className="text-xs text-zinc-400 dark:text-[#585863] font-mono">
                    {stat.sublabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
