"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { HeroSectionContent } from "@/types/content";
import { Play, Pause, ChevronDown, Sparkles } from "lucide-react";

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
  const remasteredImagesRef = useRef<HTMLImageElement[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [remasteredLoaded, setRemasteredLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Engine mode: "frames" (enhanced original 44-frame walk sequence) or "remastered" (8K staged)
  const mode = content.mode || "frames";
  const totalFrames = content.totalFrames || 44;
  const currentProgressRef = useRef(0);
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

  // Preload all 44 original frames (sitting in chair -> rising -> walking forward)
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

  // Preload 8K remastered keyframe images
  useEffect(() => {
    let active = true;
    const stages = [
      "/images/remastered/stage1_sitting.jpg",
      "/images/remastered/stage2_rising.jpg",
      "/images/remastered/stage3_walking.jpg",
    ];

    const loaded: HTMLImageElement[] = [];
    let loadedStages = 0;

    stages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (!active) return;
        loadedStages++;
        if (loadedStages === stages.length) {
          setRemasteredLoaded(true);
        }
      };
      loaded.push(img);
    });

    remasteredImagesRef.current = loaded;

    return () => {
      active = false;
    };
  }, []);

  // Draw enhanced frame on canvas
  const renderCanvas = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Enable high-quality bicubic image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Set pitch black background
    ctx.fillStyle = "#080809";
    ctx.fillRect(0, 0, width, height);

    if (mode === "remastered" && remasteredLoaded && remasteredImagesRef.current.length === 3) {
      // 8K Remastered 3-Stage Cinematic Progression (Sitting -> Rising -> Walking)
      const stages = remasteredImagesRef.current;
      let imgA = stages[0];
      let imgB = stages[1];
      let blend = 0;

      if (progress < 0.45) {
        // Stage 1 to Stage 2: Sitting to Rising
        imgA = stages[0];
        imgB = stages[1];
        blend = Math.max(0, Math.min(1, (progress - 0.15) / 0.3));
      } else {
        // Stage 2 to Stage 3: Rising to Walking forward
        imgA = stages[1];
        imgB = stages[2];
        blend = Math.max(0, Math.min(1, (progress - 0.45) / 0.4));
      }

      const imgRatio = imgA.naturalWidth / imgA.naturalHeight;
      const canvasRatio = width / height;

      let drawWidth = width;
      let drawHeight = height;
      if (canvasRatio > imgRatio) {
        drawHeight = width / imgRatio;
      } else {
        drawWidth = height * imgRatio;
      }

      // Smooth camera dolly push
      const scale = 1.0 + progress * 0.15;
      const finalW = drawWidth * scale;
      const finalH = drawHeight * scale;
      const offsetX = (width - finalW) / 2;
      const offsetY = (height - finalH) / 2 - progress * (height * 0.03);

      ctx.save();
      ctx.filter = "contrast(1.08) brightness(1.02) saturate(1.04)";
      ctx.globalAlpha = 1;
      ctx.drawImage(imgA, offsetX, offsetY, finalW, finalH);

      if (blend > 0) {
        ctx.globalAlpha = blend;
        ctx.drawImage(imgB, offsetX, offsetY, finalW, finalH);
      }
      ctx.restore();
    } else {
      // Enhanced 44-Frame Sequence (sitting in chair -> rising -> walking forward)
      const images = imagesRef.current;
      if (images.length === 0) return;

      const total = totalFrames - 1;
      const rawFrame = progress * total;
      const frameA = Math.min(total, Math.max(0, Math.floor(rawFrame)));
      const frameB = Math.min(total, frameA + 1);
      const blend = rawFrame - frameA;

      const imgA = images[frameA] || images[0];
      const imgB = images[frameB] || imgA;

      if (!imgA || !imgA.complete || imgA.naturalWidth === 0) return;

      const imgRatio = imgA.naturalWidth / imgA.naturalHeight;
      const canvasRatio = width / height;

      let drawWidth = width;
      let drawHeight = height;
      if (canvasRatio > imgRatio) {
        drawHeight = width / imgRatio;
      } else {
        drawWidth = height * imgRatio;
      }

      // Smooth subtle camera tracking as person stands and walks forward
      const scale = 1.0 + progress * 0.12;
      const finalW = drawWidth * scale;
      const finalH = drawHeight * scale;
      const offsetX = (width - finalW) / 2;
      const offsetY = (height - finalH) / 2 - progress * (height * 0.02);

      ctx.save();
      // Color grading & contrast boost to remove washed out blacks and enhance spotlight depth
      ctx.filter = "contrast(1.12) brightness(1.02) saturate(1.06)";

      // Draw primary frame
      ctx.globalAlpha = 1;
      ctx.drawImage(imgA, offsetX, offsetY, finalW, finalH);

      // Smooth sub-frame crossfade interpolation for continuous 60fps/120fps motion
      if (blend > 0.01 && imgB && imgB.complete && imgB.naturalWidth > 0) {
        ctx.globalAlpha = blend;
        ctx.drawImage(imgB, offsetX, offsetY, finalW, finalH);
      }

      ctx.restore();
    }

    // LUXURY STUDIO VIGNETTE: masks any corner artifacts/watermarks and enriches contrast
    const spotlightGradient = ctx.createRadialGradient(
      width / 2,
      height * 0.42,
      width * 0.15,
      width / 2,
      height * 0.5,
      width * 0.75
    );
    spotlightGradient.addColorStop(0, "rgba(8, 8, 9, 0)");
    spotlightGradient.addColorStop(0.6, "rgba(8, 8, 9, 0.2)");
    spotlightGradient.addColorStop(0.85, "rgba(8, 8, 9, 0.7)");
    spotlightGradient.addColorStop(1, "#080809");

    ctx.fillStyle = spotlightGradient;
    ctx.fillRect(0, 0, width, height);
  }, [mode, totalFrames, remasteredLoaded]);

  // Resize canvas according to device pixel ratio
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      renderCanvas(currentProgressRef.current);
    }
  }, [renderCanvas]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  // Initial draw
  useEffect(() => {
    if (loadedCount > 0 || remasteredLoaded) {
      renderCanvas(0);
    }
  }, [loadedCount, remasteredLoaded, renderCanvas]);

  // Scroll listener with coalesced requestAnimationFrame updates
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

        const rawProgress = -rect.top / totalScrollable;
        const progress = Math.max(0, Math.min(1, rawProgress));

        setScrollProgress(progress);
        currentProgressRef.current = progress;
        renderCanvas(progress);
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
  }, [isPaused, reducedMotion, renderCanvas]);

  // Headlines transitions based on scrollProgress
  const initialOpacity = Math.max(0, 1 - scrollProgress / 0.24);
  const initialTranslateY = -scrollProgress * 70;

  const closingOpacity =
    scrollProgress < 0.65
      ? 0
      : scrollProgress > 0.95
      ? Math.max(0, 1 - (scrollProgress - 0.95) * 15)
      : Math.min(1, (scrollProgress - 0.65) / 0.15);

  const closingTranslateY = Math.max(0, 35 - (scrollProgress - 0.65) * 110);

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
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#080809] to-transparent z-10 opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#080809] via-[#080809]/80 to-transparent z-10" />

        {/* TOP STATUS BAR: Motion Control & Progress */}
        <div className="relative z-20 pt-24 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#90909c] bg-[#161619]/80 backdrop-blur border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
              <span>
                {mode === "remastered"
                  ? "8K Remastered Keyframes"
                  : `Enhanced 44-Frame Sequence`}
              </span>
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
            <Sparkles className="w-3.5 h-3.5 text-[#c6f36b]" />
            <span>PROGRESS</span>
            <span className="text-white font-semibold">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

        {/* CENTER CONTENT: Dynamic Editorial Headlines */}
        <div className="relative z-20 px-6 sm:px-12 max-w-6xl mx-auto w-full my-auto flex flex-col justify-center">
          {/* 1. Initial Opening Headline (Fades smoothly on scroll) */}
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
