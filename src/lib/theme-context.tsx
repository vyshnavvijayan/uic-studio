"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "uic-theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  // Apply theme to document root
  const applyTheme = useCallback((targetTheme: ResolvedTheme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (targetTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }

    // Notify listeners (e.g. Canvas contexts)
    window.dispatchEvent(
      new CustomEvent("uic:theme-changed", {
        detail: { theme: targetTheme },
      })
    );
  }, []);

  // Initialize theme on client mount
  useEffect(() => {
    let savedTheme: Theme = "dark";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "dark" || stored === "light" || stored === "system") {
        savedTheme = stored;
      } else {
        // Check current class on document (set by inline anti-FOUC script)
        if (document.documentElement.classList.contains("light")) {
          savedTheme = "light";
        }
      }
    } catch {
      // Fallback
    }

    setThemeState(savedTheme);
    const resolved = savedTheme === "system" ? getSystemTheme() : savedTheme;
    setResolvedTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, [applyTheme]);

  // System theme change listener
  useEffect(() => {
    if (!mounted) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const sys = getSystemTheme();
        setResolvedTheme(sys);
        applyTheme(sys);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted, applyTheme]);

  // Multi-tab synchronization
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const newTheme = e.newValue as Theme;
        if (newTheme === "dark" || newTheme === "light" || newTheme === "system") {
          setThemeState(newTheme);
          const resolved = newTheme === "system" ? getSystemTheme() : newTheme;
          setResolvedTheme(resolved);
          applyTheme(resolved);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [applyTheme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch {
        // Storage unavailable
      }
      const resolved = newTheme === "system" ? getSystemTheme() : newTheme;
      setResolvedTheme(resolved);
      applyTheme(resolved);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
