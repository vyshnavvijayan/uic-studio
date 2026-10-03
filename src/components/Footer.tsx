"use client";

import React from "react";
import Link from "next/link";
import { FooterSectionContent, BrandSettings } from "@/types/content";
import { ArrowUpRight } from "lucide-react";

interface FooterProps {
  content: FooterSectionContent;
  brand: BrandSettings;
  accentColor?: string;
}

export const Footer: React.FC<FooterProps> = ({
  content,
  brand,
  accentColor = "#c6f36b",
}) => {
  return (
    <footer className="relative bg-[#050506] border-t border-white/[0.08] py-20 px-6 sm:px-8 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Top Grid: Wordmark, Nav, Socials, Admin */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Studio Brand & Tagline */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link
              href="#hero"
              className="inline-flex items-center gap-3 text-xl font-bold tracking-tight text-white hover:text-[#c6f36b] transition-colors"
            >
              {brand.logoUrl && (
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/[0.04] p-1 border border-white/10 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={brand.logoUrl}
                    alt={brand.wordmark || "Brand Logo"}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <span>{content.wordmark || brand.wordmark}</span>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
            </Link>
            <p className="text-sm text-[#90909c] font-sans font-light max-w-sm leading-relaxed">
              {content.tagline}
            </p>
            <div className="text-[11px] text-[#585863] mt-2">
              {content.locationNotice}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-widest text-[#585863] mb-1">
              Index
            </span>
            {brand.navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="text-[#90909c] hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Social Channels & Admin Portal */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-widest text-[#585863] mb-1">
              Channels & Access
            </span>
            {brand.socialLinks.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#90909c] hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <span>{soc.label}</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright and disclaimer */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#585863] text-[11px]">
          <span>{content.copyrightText}</span>
          <div className="flex items-center gap-6">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
