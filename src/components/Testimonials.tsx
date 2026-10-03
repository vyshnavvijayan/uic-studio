"use client";

import React from "react";
import { TestimonialsSectionContent } from "@/types/content";
import { Quote } from "lucide-react";

interface TestimonialsProps {
  content: TestimonialsSectionContent;
  accentColor?: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  content,
  accentColor = "#c6f36b",
}) => {
  // Keep placeholder testimonials hidden until the admin approves them
  const approvedItems = content.items.filter((item) => item.approved);

  if (approvedItems.length === 0) {
    return null; // Clean fallback when no quotes are approved yet
  }

  // Duplicate items for seamless continuous marquee loop
  const marqueeItems = [...approvedItems, ...approvedItems];

  return (
    <section id="testimonials" className="relative py-28 sm:py-36 border-t border-white/[0.06] bg-[#080809] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-xs font-mono uppercase tracking-widest text-[#90909c]">
              {content.label || "Endorsements"}
            </span>
            <span className="text-xs font-mono text-[#585863]">/ 06</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#f5f5f7]">
            {content.title}
          </h2>
        </div>
      </div>

      {/* MARQUEE WRAPPER WITH FADED GRADIENT EDGES */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Faded Edge Masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-[#080809] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-[#080809] to-transparent z-10" />

        <div className="flex gap-6 animate-marquee">
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              tabIndex={0}
              className="w-[340px] sm:w-[420px] flex-shrink-0 p-8 rounded-2xl bg-[#0d0d10] border border-white/[0.06] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <Quote className="w-5 h-5 text-[#c6f36b] mb-4 opacity-70" />
                <p className="text-sm sm:text-base text-[#f5f5f7] leading-relaxed font-light italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center font-mono text-xs text-white">
                  {item.avatarText}
                </div>
                <div>
                  <span className="text-xs font-medium text-white block">
                    {item.author}
                  </span>
                  <span className="text-[11px] font-mono text-[#90909c]">
                    {item.role}, {item.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
