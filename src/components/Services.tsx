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

export const Services: React.FC<ServicesProps> = ({
  content,
  accentColor = "#c6f36b",
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="services" className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-white/[0.06] bg-[#080809]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <span className="text-xs font-mono uppercase tracking-widest text-[#90909c]">
                {content.label || "Studio Capabilities"}
              </span>
              <span className="text-xs font-mono text-[#585863]">/ 02</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#f5f5f7]">
              {content.title}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#90909c] max-w-md font-light">
            {content.subtitle}
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((service, idx) => {
            const Icon = iconMap[service.icon] || Sparkles;
            const isExpanded = expandedId === service.id;

            return (
              <div
                key={service.id}
                onClick={() => toggleExpand(service.id)}
                className={`group relative rounded-2xl border transition-all duration-300 p-8 flex flex-col justify-between cursor-pointer ${
                  isExpanded
                    ? "bg-[#121215] border-[#c6f36b]/40 shadow-xl"
                    : "bg-[#0d0d10] border-white/[0.06] hover:border-white/20 hover:bg-[#101013]"
                }`}
              >
                <div>
                  {/* Top Bar: Category & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#90909c] bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
                      {service.category}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white group-hover:text-[#c6f36b] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mb-4">
                    <span className="text-xs font-mono text-[#585863] block mb-2">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-medium text-[#f5f5f7] tracking-tight group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-sm text-[#90909c] leading-relaxed font-light mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Features Inspection */}
                <div>
                  {isExpanded && (
                    <div className="pt-4 border-t border-white/[0.06] mb-4 flex flex-col gap-2 animate-in fade-in duration-200">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#c6f36b]">
                        Technical Specifications:
                      </span>
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-[#90909c]">
                          <Check className="w-3.5 h-3.5 text-[#c6f36b] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-mono text-[#90909c] pt-2">
                    <span className="text-[11px] uppercase tracking-wider group-hover:text-white transition-colors">
                      {isExpanded ? "Collapse Specs" : "Inspect Parameters"}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-[#90909c] group-hover:text-white transition-transform ${
                        isExpanded ? "rotate-90 text-[#c6f36b]" : ""
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
