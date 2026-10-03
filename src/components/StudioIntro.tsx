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
  return (
    <section id="studio" className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-white/[0.06] bg-[#080809]">
      <div className="max-w-7xl mx-auto">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-10">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-xs font-mono uppercase tracking-widest text-[#90909c]">
            {content.label || "Unique Identity Creation"}
          </span>
          <span className="text-xs font-mono text-[#585863]">/ 01</span>
        </div>

        {/* Big Editorial Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#f5f5f7] leading-[1.12]">
              {content.title}
            </h2>
            <div className="mt-8 flex items-center gap-3 text-xs font-mono tracking-widest text-[#90909c]">
              <span className="text-[#c6f36b]">●</span>
              <span>{content.locations}</span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6 text-[#90909c] text-base sm:text-lg leading-relaxed font-light">
            {content.descriptionParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Architectural Stats Grid */}
        <div className="mt-20 pt-16 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {content.stats.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-1.5">
              <span className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-[#f5f5f7]">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-white mt-1">
                {stat.label}
              </span>
              {stat.sublabel && (
                <span className="text-xs text-[#585863] font-mono">
                  {stat.sublabel}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
