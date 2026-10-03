"use client";

import React from "react";
import { ProcessSectionContent } from "@/types/content";

interface ProcessProps {
  content: ProcessSectionContent;
  accentColor?: string;
}

export const Process: React.FC<ProcessProps> = ({
  content,
  accentColor = "#c6f36b",
}) => {
  return (
    <section id="process" className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-white/[0.06] bg-[#080809]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-24">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <span className="text-xs font-mono uppercase tracking-widest text-[#90909c]">
                {content.label || "Methodology"}
              </span>
              <span className="text-xs font-mono text-[#585863]">/ 05</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#f5f5f7]">
              {content.title}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#90909c] max-w-md font-light">
            {content.subtitle}
          </p>
        </div>

        {/* Process Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {content.steps.map((step, idx) => (
            <div
              key={step.id}
              className="relative p-8 rounded-2xl bg-[#0d0d10] border border-white/[0.06] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Step Number & Duration */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-white/30 hover:text-[#c6f36b] transition-colors">
                    {step.stepNumber}
                  </span>
                  {step.duration && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#90909c] bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
                      {step.duration}
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono uppercase tracking-widest text-[#c6f36b] block mb-2">
                  {step.subtitle}
                </span>

                <h3 className="text-xl font-medium text-white tracking-tight mb-4">
                  {step.title}
                </h3>

                <p className="text-sm text-[#90909c] leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-[#585863]">
                <span>STAGE 0{idx + 1}</span>
                <span>VERIFIED PROTOCOL</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
