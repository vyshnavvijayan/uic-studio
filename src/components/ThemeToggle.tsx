"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
  isOverDark?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = false,
  className = "",
  isOverDark = false,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Tactile Skeleton placeholder to prevent layout shift during SSR/hydration
    return (
      <div
        className={`w-[62px] h-[32px] rounded-full bg-zinc-200/50 dark:bg-white/[0.05] animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Neumorphic Tactile Pill Switch */}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        className={`relative w-[64px] h-[32px] rounded-full p-[3px] select-none cursor-pointer transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#c6f36b] active:scale-[0.96] flex items-center justify-between ${
          isOverDark
            ? "neu-inset-dark border border-white/15"
            : isDark
            ? "neu-inset-dark border border-white/[0.08]"
            : "neu-inset-light border border-black/[0.06]"
        }`}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Activate Light Mode" : "Activate Dark Mode"}
      >
        {/* Background Embedded Icon Left: Solar Indicator */}
        <div className="w-[26px] h-[26px] flex items-center justify-center z-0 transition-opacity duration-300">
          <Sun
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              !isDark
                ? "text-amber-500 opacity-90 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                : "text-zinc-600 dark:text-zinc-500 opacity-40 hover:opacity-70"
            }`}
          />
        </div>

        {/* Background Embedded Icon Right: Lunar Indicator */}
        <div className="w-[26px] h-[26px] flex items-center justify-center z-0 transition-opacity duration-300">
          <Moon
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              isDark
                ? "text-[#c6f36b] opacity-90 drop-shadow-[0_0_6px_rgba(198,243,107,0.5)]"
                : "text-zinc-400 opacity-40 hover:opacity-70"
            }`}
          />
        </div>

        {/* Neumorphic Extruded Floating Thumb Knob */}
        <div
          className={`absolute top-[3px] left-[3px] w-[26px] h-[26px] rounded-full flex items-center justify-center transition-all duration-350 ease-[cubic-bezier(0.34,1.4,0.64,1)] pointer-events-none z-10 ${
            isDark
              ? "translate-x-[32px] neu-thumb-dark text-[#c6f36b]"
              : "translate-x-0 neu-thumb-light text-amber-500"
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 drop-shadow-[0_0_4px_rgba(198,243,107,0.4)]" />
          ) : (
            <Sun className="w-3.5 h-3.5 drop-shadow-[0_0_4px_rgba(245,158,11,0.35)]" />
          )}
        </div>
      </button>

      {/* Optional Label */}
      {showLabel && (
        <span
          className={`text-[11px] font-mono uppercase tracking-wider font-medium transition-colors ${
            isOverDark
              ? "text-zinc-300"
              : isDark
              ? "text-zinc-400"
              : "text-zinc-600"
          }`}
        >
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </div>
  );
};
