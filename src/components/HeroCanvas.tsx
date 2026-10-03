"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { HeroSectionContent } from "@/types/content";
import { Play, Pause, ChevronDown } from "lucide-react";

interface HeroCanvasProps {
  content: HeroSectionContent;
  accentColor?: string;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({
  content,
  accentColor = "#c6f36b",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);

  const totalFrames = content.totalFrames || 44;
  const currentFrameRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isIntersectingRef = useRef(true);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Preload all 44 frames
  useEffect(() => {
    let active = true;
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const numStr = String(i).padStart(4, "0");
      img.src = `${content.frameBasePath}/${numStr}.webp`;
      img.onload = () => {
        if (!active) return;
        count++;
        setLoadedCount(count);
        if (count === totalFrames) {
          setCanvasReady(true);
        }
      };
      img.onerror = () => {
        if (!active) return;
        count++;
        setLoadedCount(count);
      };
      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;

    return () => {
      active = false;
    };
  }, [totalFrames, content.frameBasePath]);

  // Draw frame on canvas with object-fit: cover logic
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex] || imagesRef.current[0];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Get display size
    const width = canvas.width;
    const height = canvas.height;

    // Calculate aspect ratio cover
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Subtle luxury vignette gradient overlay
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.18,
      width / 2,
      height / 2,
      width * 0.75
    );
    gradient.addColorStop(0, "rgba(8, 8, 9, 0)");
    gradient.addColorStop(1, "rgba(8, 8, 9, 0.75)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, []);

  // Resize canvas to match display pixel ratio
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      renderFrame(currentFrameRef.current);
    }
  }, [renderFrame]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  // Initial draw when first frame is loaded
  useEffect(() => {
    if (loadedCount > 0) {
      renderFrame(0);
    }
  }, [loadedCount, renderFrame]);

  // Scroll listener with coalesced requestAnimationFrame updates
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Observe container intersection to stop listening when scrolled past
    const observer = new IntersectionObserver(
      (entries) => {
        isIntersectingRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const onScroll = () => {
      if (!isIntersectingRef.current || isPaused || reducedMotion) return;

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        if (totalScrollable <= 0) return;

        // Current progress between 0 and 1
        const rawProgress = -rect.top / totalScrollable;
        const progress = Math.max(0, Math.min(1, rawProgress));
        setScrollProgress(progress);

        // Calculate target frame
        const targetFrame = Math.min(
          totalFrames - 1,
          Math.floor(progress * totalFrames)
        );

        if (targetFrame !== currentFrameRef.current) {
          currentFrameRef.current = targetFrame;
          renderFrame(targetFrame);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isPaused, reducedMotion, totalFrames, renderFrame]);

  // Opacity and transform calculations for headlines based on scrollProgress
  // Initial headline: visible from 0 to 0.25, then fades and moves up
  const initialOpacity = Math.max(0, 1 - scrollProgress / 0.22);
  const initialTranslateY = -scrollProgress * 60;

  // Closing headline: appears between 0.70 and 0.95
  const closingOpacity =
    scrollProgress < 0.65
      ? 0
      : scrollProgress > 0.95
      ? Math.max(0, 1 - (scrollProgress - 0.95) * 15)
      : Math.min(1, (scrollProgress - 0.65) / 0.15);

  const closingTranslateY = Math.max(0, 30 - (scrollProgress - 0.65) * 100);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full bg-[#080809]"
      style={{ height: reducedMotion ? "100vh" : "260vh" }}
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        {/* Canvas or Reduced-motion Poster */}
        {reducedMotion ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${content.posterUrl})` }}
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover block"
            style={{ width: "100%", height: "100%" }}
          />
        )}

        {/* Ambient Top & Bottom Vignettes */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080809] to-transparent z-10 opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#080809] via-[#080809]/80 to-transparent z-10" />

        {/* TOP STATUS BAR: Motion Control & Progress */}
        <div className="relative z-20 pt-24 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#90909c] bg-[#161619]/80 backdrop-blur border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ backgroundColor: accentColor }}
              />
              Cinematic Sequence
            </span>

            {/* Pause/Resume Motion Toggle */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-full bg-[#161619]/80 backdrop-blur border border-white/10 hover:border-white/20 text-[#90909c] hover:text-white transition-colors"
              aria-label={isPaused ? "Resume scroll sequence" : "Pause scroll sequence"}
              title={isPaused ? "Resume motion" : "Pause motion"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#90909c]">
            <span>FRAME</span>
            <span className="text-white font-semibold">
              {String(currentFrameRef.current + 1).padStart(2, "0")}
            </span>
            <span>/</span>
            <span>{totalFrames}</span>
          </div>
        </div>

        {/* CENTER CONTENT: Dynamic Editorial Headlines */}
        <div className="relative z-20 px-6 sm:px-12 max-w-6xl mx-auto w-full my-auto flex flex-col justify-center">
          {/* 1. Initial Opening Headline (Fades on scroll) */}
          <div
            className="transition-opacity duration-100 ease-out will-change-transform"
            style={{
              opacity: reducedMotion ? 1 : initialOpacity,
              transform: reducedMotion ? "none" : `translateY(${initialTranslateY}px)`,
              pointerEvents: initialOpacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xs uppercase font-mono tracking-widest text-[#c6f36b]">
                Unique Identity Creation
              </span>
              <span className="w-8 h-[1px] bg-[#c6f36b]/40" />
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#f5f5f7] leading-[1.03] uppercase">
              {content.headlineLine1}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5f5f7] to-[#90909c]">
                {content.headlineLine2}
              </span>
            </h1>

            <p className="mt-6 sm:mt-8 text-base sm:text-xl text-[#90909c] max-w-xl font-light leading-relaxed">
              {content.subtitle}
            </p>
          </div>

          {/* 2. Closing Climax Headline (Fades in near bottom of sequence) */}
          {!reducedMotion && (
            <div
              className="absolute left-6 right-6 sm:left-12 sm:right-12 max-w-4xl will-change-transform"
              style={{
                opacity: closingOpacity,
                transform: `translateY(${closingTranslateY}px)`,
                pointerEvents: closingOpacity > 0.3 ? "auto" : "none",
              }}
            >
              <span className="text-xs uppercase font-mono tracking-widest text-[#c6f36b] block mb-3">
                [ Statement 01 ]
              </span>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                {content.closingHeadline || "More than a first impression."}
              </h2>
              <p className="mt-4 text-sm sm:text-lg text-[#90909c] max-w-lg">
                Crafted to outlast ordinary digital introductions. Physical weight combined with dynamic edge connectivity.
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS: Scroll progress indicator & Persistent Explore link */}
        <div className="relative z-20 pb-8 px-6 sm:px-12 flex items-end justify-between">
          {/* Persistent Explore link */}
          <a
            href="#studio"
            className="group inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-[#90909c] hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-[#c6f36b] flex items-center justify-center transition-colors">
              <ChevronDown className="w-4 h-4 text-[#c6f36b] group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span>{content.exploreText || "Explore the studio"}</span>
          </a>

          {/* Thin Scroll-Progress Line */}
          <div className="w-32 sm:w-48 flex flex-col gap-1.5 items-end">
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-75 rounded-full"
                style={{
                  width: `${Math.round(scrollProgress * 100)}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>
            <span className="font-mono text-[9px] text-[#90909c] tracking-widest">
              {Math.round(scrollProgress * 100)}% SCROLLED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
