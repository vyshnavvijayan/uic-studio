"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandSettings } from "@/types/content";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  brand: BrandSettings;
  onOpenInquiry?: () => void;
  isEmbeddedPreview?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  brand,
  onOpenInquiry,
  isEmbeddedPreview = false,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isEmbeddedPreview) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isEmbeddedPreview]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isEmbeddedPreview) {
      e.preventDefault();
      if (href.startsWith("#")) {
        const id = href.replace("#", "");
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const isOverDark = !scrolled && !isEmbeddedPreview;

  return (
    <header
      className={`${
        isEmbeddedPreview
          ? "sticky top-0 left-0 right-0 z-20 bg-white/90 dark:bg-[#080809]/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-white/[0.07] py-3.5 shadow-sm dark:shadow-none"
          : `fixed top-0 left-0 right-0 z-50 ${
              scrolled
                ? "bg-white/85 dark:bg-[#080809]/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-white/[0.07] py-3.5 shadow-sm dark:shadow-none"
                : "bg-transparent py-5"
            }`
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className={`group flex items-center gap-2.5 tracking-tighter font-semibold text-lg sm:text-xl transition-colors ${
            isOverDark
              ? "text-[#f5f5f7] hover:text-white"
              : "text-zinc-900 dark:text-[#f5f5f7] hover:text-black dark:hover:text-white"
          }`}
        >
          {brand.logoUrl ? (
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg overflow-hidden p-1 border transition-colors flex-shrink-0 ${
                isOverDark
                  ? "bg-white/[0.04] border-white/10 group-hover:border-[#c6f36b]/40"
                  : "bg-zinc-100 dark:bg-white/[0.04] border-zinc-200 dark:border-white/10 group-hover:border-zinc-400 dark:group-hover:border-[#c6f36b]/40"
              }`}
            >
              <img
                src={brand.logoUrl}
                alt={brand.wordmark || "Brand Logo"}
                className="w-full h-full object-contain"
              />
            </div>
          ) : null}

          {(brand.showWordmarkWithLogo ?? true) && (
            <div className="flex items-center gap-1.5">
              <span
                className={`font-mono text-xs tracking-widest transition-colors ${
                  isOverDark
                    ? "text-[#90909c] group-hover:text-[#c6f36b]"
                    : "text-zinc-400 dark:text-[#90909c] group-hover:text-zinc-700 dark:group-hover:text-[#c6f36b]"
                }`}
              >
                [
              </span>
              <span className="tracking-wider">{brand.wordmark || "UIC STUDIO"}</span>
              <span
                className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                style={{ backgroundColor: brand.accentColor || "#c6f36b" }}
              />
              <span
                className={`font-mono text-xs tracking-widest transition-colors ${
                  isOverDark
                    ? "text-[#90909c] group-hover:text-[#c6f36b]"
                    : "text-zinc-400 dark:text-[#90909c] group-hover:text-zinc-700 dark:group-hover:text-[#c6f36b]"
                }`}
              >
                ]
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav
          className={`hidden md:flex items-center gap-7 text-xs uppercase tracking-widest ${
            isOverDark ? "text-[#90909c]" : "text-zinc-600 dark:text-[#90909c]"
          }`}
        >
          {brand.navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`transition-colors duration-200 font-medium ${
                isOverDark
                  ? "hover:text-[#f5f5f7]"
                  : "hover:text-zinc-950 dark:hover:text-[#f5f5f7]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls: Theme Toggle & Commission Button */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle isOverDark={isOverDark} />

          <button
            onClick={onOpenInquiry}
            className={`relative group overflow-hidden rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-sm ${
              isOverDark
                ? "border border-[#c6f36b]/40 bg-[#c6f36b]/10 hover:bg-[#c6f36b] text-[#c6f36b] hover:text-[#080809]"
                : "border border-zinc-900/10 dark:border-[#c6f36b]/40 bg-[#c6f36b] dark:bg-[#c6f36b]/10 hover:bg-[#b9ed5a] dark:hover:bg-[#c6f36b] text-zinc-950 dark:text-[#c6f36b] hover:text-black dark:hover:text-[#080809]"
            }`}
          >
            <span>Commission</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle isOverDark={isOverDark} />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border transition-colors ${
              isOverDark
                ? "text-[#f5f5f7] hover:text-white border-white/10 bg-white/[0.04]"
                : "text-zinc-800 dark:text-[#f5f5f7] hover:text-black dark:hover:text-white border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-white/[0.02]"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-[#080809]/95 backdrop-blur-xl border-b border-zinc-200 dark:border-white/[0.08] px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200 shadow-xl">
          {brand.navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick(e, item.href);
              }}
              className="text-sm uppercase tracking-widest text-zinc-600 dark:text-[#90909c] hover:text-zinc-950 dark:hover:text-white py-2 border-b border-zinc-100 dark:border-white/[0.04] font-medium"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/[0.04]">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-[#90909c]">
                Appearance
              </span>
              <ThemeToggle showLabel />
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry?.();
              }}
              className="w-full text-center rounded-full bg-[#c6f36b] text-zinc-950 py-2.5 text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-[#b9ed5a] transition-colors"
            >
              Start Commission
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
