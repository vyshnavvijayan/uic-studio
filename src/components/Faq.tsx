"use client";

import React, { useState } from "react";
import { FaqSectionContent } from "@/types/content";
import { Plus, Minus } from "lucide-react";

interface FaqProps {
  content: FaqSectionContent;
  accentColor?: string;
}

export const Faq: React.FC<FaqProps> = ({
  content,
  accentColor = "#c6f36b",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-zinc-200 dark:border-white/[0.06] bg-[var(--bg-primary)] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-[#90909c]">
                {content.label || "Inquiries & Specifics"}
              </span>
              <span className="text-xs font-mono text-zinc-400 dark:text-[#585863]">/ 07</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-zinc-950 dark:text-[#f5f5f7]">
              {content.title}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-[#90909c] max-w-md font-light">
            {content.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl mx-auto divide-y divide-zinc-200 dark:divide-white/[0.08] border-y border-zinc-200 dark:border-white/[0.08]">
          {content.items.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={item.id} className="py-6 sm:py-8 group">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left flex items-start justify-between gap-6 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg sm:text-2xl font-medium text-zinc-900 dark:text-[#f5f5f7] group-hover:text-black dark:group-hover:text-white transition-colors">
                    {item.question}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-zinc-200 dark:border-white/10 group-hover:border-zinc-400 dark:group-hover:border-white/30 flex items-center justify-center flex-shrink-0 text-zinc-500 dark:text-[#90909c] group-hover:text-zinc-950 dark:group-hover:text-white bg-zinc-50 dark:bg-white/[0.02] transition-all">
                    {isOpen ? <Minus className="w-4 h-4 text-emerald-600 dark:text-[#c6f36b]" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 pr-12 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-sm sm:text-base text-zinc-600 dark:text-[#90909c] leading-relaxed font-light">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
