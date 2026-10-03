"use client";

import React, { useState, useEffect, useRef } from "react";
import { NfcShowcaseSectionContent, NfcCardItem } from "@/types/content";
import {
  Play,
  Pause,
  Radio,
  ShieldCheck,
  Sparkles,
  Smartphone,
  RotateCw,
  Sliders,
  Check,
  QrCode,
  Layers,
  Wand2,
  Cpu,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Trash2,
  Palette,
  Grid,
} from "lucide-react";
import confetti from "canvas-confetti";

interface NfcShowcaseProps {
  content: NfcShowcaseSectionContent;
  accentColor?: string;
  onOpenInquiry?: () => void;
}

type MaterialType = "obsidian" | "gold" | "titanium" | "carbon" | "emerald";
type FoilType = "gold" | "silver" | "neon" | "holographic";
type ChipType = "gold" | "silver" | "black";
type PatternType = "none" | "carbon" | "circuit" | "honeycomb" | "hatch";

interface MaterialConfig {
  id: MaterialType;
  name: string;
  category: string;
  weight: string;
  color: string;
  accent: string;
  gradientClass: string;
  borderClass: string;
  description: string;
}

const MATERIALS: Record<MaterialType, MaterialConfig> = {
  obsidian: {
    id: "obsidian",
    name: "Obsidian Ceramic",
    category: "Ultra-Matte Engineered Ceramic",
    weight: "28.5g",
    color: "#0d0d10",
    accent: "#c6f36b",
    gradientClass: "from-[#0e0e12] via-[#141419] to-[#09090b]",
    borderClass: "border-white/10 hover:border-white/20",
    description: "Cold-pressed black zirconium ceramic with non-reflective matte finish.",
  },
  gold: {
    id: "gold",
    name: "24K Brushed Brass",
    category: "Precious Heavy Alloy",
    weight: "34.0g",
    color: "#241d11",
    accent: "#f59e0b",
    gradientClass: "from-[#2e2413] via-[#3a2e18] to-[#1c160a]",
    borderClass: "border-amber-400/30 hover:border-amber-400/50",
    description: "Deep champagne metallic brass with directional satin hairline brush.",
  },
  titanium: {
    id: "titanium",
    name: "Aerospace Titanium",
    category: "Grade 5 Ti-6Al-4V",
    weight: "21.5g",
    color: "#1c1f26",
    accent: "#38bdf8",
    gradientClass: "from-[#222733] via-[#2a303f] to-[#181a20]",
    borderClass: "border-cyan-400/30 hover:border-cyan-400/50",
    description: "Bead-blasted ballistic titanium alloy with micro-anodized edge contour.",
  },
  carbon: {
    id: "carbon",
    name: "Forged Carbon Weave",
    category: "Aviation 3K Pre-preg",
    weight: "18.0g",
    color: "#121215",
    accent: "#a855f7",
    gradientClass: "from-[#16161a] via-[#1d1d24] to-[#0e0e11]",
    borderClass: "border-purple-400/20 hover:border-purple-400/40",
    description: "Multiaxial dry carbon fiber sealed under a non-scratch matte epoxy resin.",
  },
  emerald: {
    id: "emerald",
    name: "Cyber Matrix Glass",
    category: "Luminescent Edge Crystal",
    weight: "26.0g",
    color: "#08130d",
    accent: "#10b981",
    gradientClass: "from-[#0b1a12] via-[#0f241a] to-[#050d09]",
    borderClass: "border-emerald-500/30 hover:border-emerald-500/50",
    description: "Smoked structural glass with neon internal edge-lighting refraction.",
  },
};

const LUXURY_PALETTES = [
  { name: "Obsidian Noir", primary: "#0a0a0d", secondary: "#16161f", accent: "#c6f36b" },
  { name: "Sovereign Navy", primary: "#07111e", secondary: "#10233b", accent: "#38bdf8" },
  { name: "Bordeaux Reserve", primary: "#1c070c", secondary: "#310d18", accent: "#fb7185" },
  { name: "Imperial Emerald", primary: "#05160d", secondary: "#0c2c1a", accent: "#34d399" },
  { name: "Midnight Amethyst", primary: "#130722", secondary: "#24103d", accent: "#c084fc" },
  { name: "Royal Gold", primary: "#261a0a", secondary: "#3f2d12", accent: "#fbbf24" },
  { name: "Gunmetal Shadow", primary: "#161820", secondary: "#262b38", accent: "#94a3b8" },
  { name: "Arctic Quartz", primary: "#dbe0e6", secondary: "#f1f5f9", accent: "#0f172a" },
];

const FOIL_STYLES: Record<FoilType, { label: string; textClass: string; hex: string }> = {
  silver: {
    label: "Liquid Silver",
    textClass: "text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2e8f0] to-[#94a3b8]",
    hex: "#e2e8f0",
  },
  gold: {
    label: "24K Gold Foil",
    textClass: "text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500",
    hex: "#f59e0b",
  },
  neon: {
    label: "Studio Lime",
    textClass: "text-[#c6f36b] drop-shadow-[0_0_12px_rgba(198,243,107,0.35)]",
    hex: "#c6f36b",
  },
  holographic: {
    label: "Prismatic Sheen",
    textClass: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200",
    hex: "#d8b4fe",
  },
};

const PRESETS = [
  {
    name: "ALEXANDER VANCE",
    title: "FOUNDER & MANAGING DIRECTOR",
    company: "VANCE CAPITAL PARTNERS",
    handle: "uic.studio/@vance",
    material: "titanium" as MaterialType,
    foil: "silver" as FoilType,
    chip: "silver" as ChipType,
    pattern: "hatch" as PatternType,
  },
  {
    name: "ELENA ROSTOVA",
    title: "EXECUTIVE CREATIVE DIRECTOR",
    company: "ATELIER ROSTOVA",
    handle: "uic.studio/@elena",
    material: "obsidian" as MaterialType,
    foil: "gold" as FoilType,
    chip: "gold" as ChipType,
    pattern: "circuit" as PatternType,
  },
  {
    name: "MARCUS CHEN",
    title: "PRINCIPAL ARCHITECT",
    company: "CHROMA RESEARCH LABS",
    handle: "uic.studio/@marcus",
    material: "carbon" as MaterialType,
    foil: "neon" as FoilType,
    chip: "black" as ChipType,
    pattern: "carbon" as PatternType,
  },
  {
    name: "SOPHIA AL-MANSOOR",
    title: "PRIVATE WEALTH ADVISOR",
    company: "AL-MANSOOR HOLDINGS",
    handle: "uic.studio/@sophia",
    material: "gold" as MaterialType,
    foil: "gold" as FoilType,
    chip: "gold" as ChipType,
    pattern: "honeycomb" as PatternType,
  },
];

export const NfcShowcase: React.FC<NfcShowcaseProps> = ({
  content,
  accentColor = "#c6f36b",
  onOpenInquiry,
}) => {
  // Mode: "catalog" (default signature editions stack) or "creator" (live customizer for guests)
  const [activeTab, setActiveTab] = useState<"creator" | "catalog">("catalog");

  // Catalog State
  const [cards, setCards] = useState<NfcCardItem[]>(content.cards);
  const [catalogIndex, setCatalogIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Customizer State
  const [customName, setCustomName] = useState("ALEXANDER VANCE");
  const [customTitle, setCustomTitle] = useState("FOUNDER & MANAGING DIRECTOR");
  const [customCompany, setCustomCompany] = useState("VANCE CAPITAL PARTNERS");
  const [customHandle, setCustomHandle] = useState("uic.studio/@vance");
  const [customMaterial, setCustomMaterial] = useState<MaterialType>("titanium");
  const [customFoil, setCustomFoil] = useState<FoilType>("silver");
  const [customChip, setCustomChip] = useState<ChipType>("silver");
  const [customPattern, setCustomPattern] = useState<PatternType>("hatch");
  const [isFlipped, setIsFlipped] = useState(false);

  // Custom Color State
  const [colorMode, setColorMode] = useState<"alloy" | "custom">("alloy");
  const [customPrimaryColor, setCustomPrimaryColor] = useState("#0b121e");
  const [customSecondaryColor, setCustomSecondaryColor] = useState("#15233b");
  const [customAccentColor, setCustomAccentColor] = useState("#38bdf8");

  // Custom Image Upload State
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);
  const [bgImageOpacity, setBgImageOpacity] = useState(70);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Interaction State
  const [isTapping, setIsTapping] = useState(false);
  const [tapSuccess, setTapSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCards(content.cards);
  }, [content.cards]);

  // Automatic cycling timer for Catalog mode
  useEffect(() => {
    if (activeTab !== "catalog" || !isAutoPlaying || cards.length <= 1) return;

    const interval = setInterval(() => {
      setCatalogIndex((prev) => (prev + 1) % cards.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeTab, isAutoPlaying, cards.length]);

  const activeCatalogCard = cards[catalogIndex] || cards[0];
  const activeMaterialConfig = MATERIALS[customMaterial];
  const activeFoilConfig = FOIL_STYLES[customFoil];

  // Active Card Background Styles
  const cardBackgroundStyle =
    colorMode === "custom"
      ? {
          background: `linear-gradient(135deg, ${customPrimaryColor} 0%, ${customSecondaryColor} 100%)`,
        }
      : undefined;

  const currentAccent =
    colorMode === "custom" ? customAccentColor : activeMaterialConfig.accent;

  // 3D Perspective Tilt & Dynamic Glare Position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePos({
      x: (y / rect.height) * -20,
      y: (x / rect.width) * 20,
      glareX,
      glareY,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  // Simulate NFC Tap Interaction with Confetti & Phone Notification
  const handleCardTap = () => {
    if (isTapping) return;
    setIsTapping(true);

    setTimeout(() => {
      setTapSuccess(true);

      // Trigger high-end celebration confetti burst
      if (typeof window !== "undefined") {
        try {
          confetti({
            particleCount: 50,
            spread: 65,
            origin: { y: 0.65 },
            colors: [currentAccent, "#c6f36b", "#f59e0b", "#ffffff"],
            disableForReducedMotion: true,
          });
        } catch {
          // ignore
        }
      }

      setTimeout(() => {
        setIsTapping(false);
        setTimeout(() => setTapSuccess(false), 3800);
      }, 600);
    }, 400);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setCustomName(preset.name);
    setCustomTitle(preset.title);
    setCustomCompany(preset.company);
    setCustomHandle(preset.handle);
    setCustomMaterial(preset.material);
    setCustomFoil(preset.foil);
    setCustomChip(preset.chip);
    setCustomPattern(preset.pattern);
    setColorMode("alloy");
    setCustomBgImage(null);
    setIsFlipped(false);
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomBgImage(url);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomLogo(url);
  };

  return (
    <section id="nfc" className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-white/[0.06] bg-[#080809] overflow-hidden">
      {/* Ambient background glow tailored to active material */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] blur-[140px] rounded-full pointer-events-none transition-colors duration-700 opacity-25"
        style={{
          backgroundColor: activeTab === "creator" ? currentAccent : accentColor,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Mode Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <span className="text-xs font-mono uppercase tracking-widest text-[#90909c]">
                {content.label || "Tactile Engineering"}
              </span>
              <span className="text-xs font-mono text-[#585863]">/ 03</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#f5f5f7]">
              {content.title}
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-[#121215] border border-white/[0.08]">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === "catalog"
                  ? "bg-[#c6f36b] text-[#080809] font-bold shadow-lg"
                  : "text-[#90909c] hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Studio Catalog ({cards.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("creator")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === "creator"
                  ? "bg-[#c6f36b] text-[#080809] font-bold shadow-lg"
                  : "text-[#90909c] hover:text-white"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Custom Studio Creator</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === "creator" ? "bg-black/20 text-[#080809]" : "bg-[#c6f36b]/15 text-[#c6f36b]"
              }`}>
                Live Demo
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CUSTOM STUDIO CREATOR */}
        {/* ========================================================================= */}
        {activeTab === "creator" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* LEFT: 3D Dual-Sided Card Display */}
            <div className="lg:col-span-7 flex flex-col items-center">
              {/* Interaction Quick Bar */}
              <div className="flex flex-wrap items-center justify-between w-full max-w-[480px] gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-[#90909c]">
                  <Radio className="w-3.5 h-3.5 text-[#c6f36b] animate-pulse" />
                  <span>TAP CARD OR CLICK BELOW TO TEST</span>
                </div>

                {/* Flip Front/Back Toggle Button */}
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-[#f5f5f7] transition-all hover:scale-105 active:scale-95"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#c6f36b]" />
                  <span>{isFlipped ? "View Front Face" : "View Back Face"}</span>
                </button>
              </div>

              {/* 3D PERSPECTIVE CARD STAGE */}
              <div
                className="relative w-full max-w-[480px] aspect-[1.586/1] cursor-pointer select-none"
                style={{ perspective: "1400px" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleCardTap}
              >
                {/* 3D Rotating Card Body */}
                <div
                  ref={cardRef}
                  className="w-full h-full relative transition-transform duration-700 ease-out"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateX(${mousePos.x}deg) rotateY(${mousePos.y + (isFlipped ? 180 : 0)}deg)`,
                  }}
                >
                  {/* ============================================================= */}
                  {/* FRONT FACE */}
                  {/* ============================================================= */}
                  <div
                    className={`absolute inset-0 rounded-[24px] p-7 sm:p-9 flex flex-col justify-between border shadow-2xl overflow-hidden ${
                      colorMode === "alloy"
                        ? `bg-gradient-to-br ${activeMaterialConfig.gradientClass} ${activeMaterialConfig.borderClass}`
                        : "border-white/20"
                    } transition-all duration-500`}
                    style={{
                      ...cardBackgroundStyle,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    {/* Uploaded Custom Background Image (if present) */}
                    {customBgImage && (
                      <div
                        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
                        style={{
                          backgroundImage: `url(${customBgImage})`,
                          opacity: bgImageOpacity / 100,
                        }}
                      />
                    )}

                    {/* Procedural Pattern Overlays */}
                    {customPattern === "carbon" && (
                      <div
                        className="absolute inset-0 pointer-events-none opacity-25"
                        style={{
                          backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 0, transparent 6px)`,
                        }}
                      />
                    )}
                    {customPattern === "circuit" && (
                      <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                          backgroundImage: `radial-gradient(circle at 10px 10px, rgba(255,255,255,0.15) 2px, transparent 0), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                          backgroundSize: "24px 24px",
                        }}
                      />
                    )}
                    {customPattern === "honeycomb" && (
                      <div
                        className="absolute inset-0 pointer-events-none opacity-15"
                        style={{
                          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1.5px, transparent 1.5px)`,
                          backgroundSize: "16px 16px",
                        }}
                      />
                    )}
                    {customPattern === "hatch" && (
                      <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.05) 25%, transparent 25%)`,
                          backgroundSize: "12px 12px",
                        }}
                      />
                    )}

                    {/* Dynamic Specular Glare Follows Cursor */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[24px] opacity-40 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle 380px at ${mousePos.glareX}% ${mousePos.glareY}%, rgba(255,255,255,0.25), transparent 70%)`,
                      }}
                    />

                    {/* Subtle Brushed Metal Texture Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.06] rounded-[24px] pointer-events-none" />

                    {/* NFC Tap Wave Ripple Rings */}
                    {isTapping && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                        <div className="w-24 h-24 rounded-full border-2 border-[#c6f36b] animate-ping opacity-80" />
                        <div className="w-44 h-44 rounded-full border border-[#c6f36b]/40 animate-ping opacity-40 delay-100" />
                      </div>
                    )}

                    {/* FRONT TOP: Wordmark, Uploaded Logo & NFC Protocol */}
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2.5">
                        {customLogo ? (
                          <div className="h-6 max-w-[100px] flex items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={customLogo}
                              alt="Custom Brand Logo"
                              className="max-h-full max-w-full object-contain filter drop-shadow"
                            />
                          </div>
                        ) : (
                          <>
                            <span className="font-mono text-xs tracking-widest text-white/90 font-bold">
                              UIC
                            </span>
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: currentAccent }}
                            />
                            <span className="text-[10px] font-mono tracking-widest text-white/60">
                              {colorMode === "custom" ? "BESPOKE" : activeMaterialConfig.weight}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                        <span className="text-[9px] uppercase tracking-widest text-[#90909c]">
                          NTAG 424 DNA
                        </span>
                        <Radio
                          className="w-3.5 h-3.5"
                          style={{ color: currentAccent }}
                        />
                      </div>
                    </div>

                    {/* FRONT CENTER: Contact Microchip */}
                    <div className="relative z-10 flex items-center gap-4 my-auto">
                      <div
                        className={`w-12 h-9 rounded-md border flex items-center justify-center p-1 transition-all ${
                          customChip === "gold"
                            ? "border-amber-400/50 bg-gradient-to-br from-amber-200/30 via-yellow-600/30 to-amber-900/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                            : customChip === "silver"
                            ? "border-slate-300/50 bg-gradient-to-br from-slate-100/30 via-slate-400/30 to-slate-700/40 shadow-[0_0_12px_rgba(226,232,240,0.2)]"
                            : "border-neutral-600/50 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                        }`}
                      >
                        <div className="w-full h-full border border-white/20 rounded flex flex-col justify-around">
                          <div className="h-[1px] bg-white/30 w-full" />
                          <div className="h-[1px] bg-white/30 w-full" />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-white/50 block">
                          ENCRYPTED HARDWARE CREDENTIAL
                        </span>
                        <span className="text-xs font-mono tracking-wider text-white/90">
                          {customCompany || "UIC ENTERPRISES"}
                        </span>
                      </div>
                    </div>

                    {/* FRONT BOTTOM: User Name & Title */}
                    <div className="relative z-10 flex items-end justify-between">
                      <div className="max-w-[75%]">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-[#90909c] block mb-1">
                          {customTitle || "CARDHOLDER"}
                        </span>
                        <h3 className={`text-lg sm:text-xl font-bold tracking-tight uppercase truncate ${activeFoilConfig.textClass}`}>
                          {customName || "ALEXANDER VANCE"}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-mono tracking-widest text-white/50 block">
                          NFC ACTIVE
                        </span>
                        <span
                          className="text-xs font-mono font-semibold"
                          style={{ color: currentAccent }}
                        >
                          TOUCH TAP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ============================================================= */}
                  {/* BACK FACE (Flipped 180deg) */}
                  {/* ============================================================= */}
                  <div
                    className={`absolute inset-0 rounded-[24px] p-7 sm:p-9 flex flex-col justify-between border shadow-2xl overflow-hidden ${
                      colorMode === "alloy"
                        ? `bg-gradient-to-br ${activeMaterialConfig.gradientClass} ${activeMaterialConfig.borderClass}`
                        : "border-white/20"
                    } transition-all duration-500`}
                    style={{
                      ...cardBackgroundStyle,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* Magnetic Stripe Bar */}
                    <div className="absolute top-6 inset-x-0 h-9 bg-black/90 border-y border-white/10 flex items-center px-6">
                      <span className="text-[8px] font-mono tracking-widest text-white/30">
                        UIC STUDIO ENCRYPTED MAGNETIC SIGNATURE TRACK // AIR-GAP SECURE
                      </span>
                    </div>

                    {/* Antenna Wire Graphic */}
                    <div className="mt-12 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#90909c]" />
                        <span className="text-[10px] font-mono text-[#90909c]">
                          ANTENNA COIL: 13.56 MHz
                        </span>
                      </div>

                      <span className="text-[9px] font-mono text-white/40">
                        AES-128 AUTHENTICATION
                      </span>
                    </div>

                    {/* Signature Strip & Simulated QR Matrix */}
                    <div className="relative z-10 flex items-center justify-between gap-6 my-auto pt-2">
                      <div className="flex-1 h-9 bg-white/10 rounded border border-white/15 px-3 flex items-center justify-between">
                        <span className="font-serif italic text-xs text-white/60">
                          {customName.toLowerCase().replace(/\s+/g, ".")}
                        </span>
                        <span className="text-[9px] font-mono text-white/40">
                          SECURITY DIGITS: 424
                        </span>
                      </div>

                      <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-md">
                        <QrCode className="w-full h-full text-[#080809]" />
                      </div>
                    </div>

                    {/* Back Bottom: Laser Serial Number & Tamper Seal */}
                    <div className="relative z-10 flex items-end justify-between border-t border-white/[0.06] pt-3">
                      <div>
                        <span className="text-[9px] font-mono tracking-widest text-white/40 block">
                          SERIAL NUMBER
                        </span>
                        <span className="text-xs font-mono text-white font-semibold">
                          UIC-NTAG-{Math.abs(customName.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 90000 + 10000)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-mono text-[#90909c] block">
                          DESTINATION URL
                        </span>
                        <span className="text-[11px] font-mono text-[#c6f36b]">
                          {customHandle}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SIMULATED SMARTPHONE NFC RECEIVER NOTIFICATION BANNER */}
              {tapSuccess && (
                <div className="mt-8 w-full max-w-[480px] p-4 rounded-2xl bg-[#141418] border border-[#c6f36b]/60 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                  <div className="w-11 h-11 rounded-xl bg-[#c6f36b]/15 border border-[#c6f36b]/30 flex items-center justify-center flex-shrink-0 text-[#c6f36b]">
                    <Smartphone className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#c6f36b]" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#c6f36b] font-semibold">
                        NFC Tag Read (140ms handoff)
                      </span>
                    </div>
                    <p className="text-xs font-medium text-white truncate mt-0.5">
                      {customName} &bull; {customCompany}
                    </p>
                    <span className="text-[10px] font-mono text-[#90909c] block truncate">
                      Navigating to: {customHandle}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons Below Card */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                <button
                  onClick={handleCardTap}
                  disabled={isTapping}
                  className="px-5 py-2.5 rounded-full bg-[#c6f36b] hover:bg-[#b5e656] text-[#080809] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Simulate NFC Tap</span>
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#c6f36b]" />
                  <span>Flip to {isFlipped ? "Front" : "Back"}</span>
                </button>
              </div>
            </div>

            {/* RIGHT: Live Workshop Studio Controls */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="p-7 sm:p-8 rounded-3xl bg-[#0d0d10] border border-white/[0.08] flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#c6f36b] block mb-1">
                      Guest Demo Studio
                    </span>
                    <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                      Customize Your Physical Card
                    </h3>
                  </div>

                  <Sliders className="w-5 h-5 text-[#90909c]" />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#90909c] block mb-2">
                    Quick Demo Presets:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyPreset(p)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 text-left transition-colors"
                      >
                        <span className="text-xs font-medium text-white block truncate">
                          {p.name.split(" ")[0]}
                        </span>
                        <span className="text-[10px] font-mono text-[#90909c] block truncate">
                          {p.title.split(" ")[0]} &bull; {p.material}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Field 1: Cardholder Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] flex items-center justify-between">
                    <span>Cardholder Name</span>
                    <span className="text-[10px] text-[#585863]">{customName.length}/26</span>
                  </label>
                  <input
                    type="text"
                    maxLength={26}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                    placeholder="E.G. ALEXANDER VANCE"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141418] border border-white/10 focus:border-[#c6f36b] text-white text-sm font-mono uppercase outline-none transition-colors"
                  />
                </div>

                {/* Field 2: Title / Designation & Organization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c]">
                      Title / Role
                    </label>
                    <input
                      type="text"
                      maxLength={32}
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value.toUpperCase())}
                      placeholder="E.G. MANAGING DIRECTOR"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-white/10 focus:border-[#c6f36b] text-white text-xs font-mono uppercase outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c]">
                      Company / Monogram
                    </label>
                    <input
                      type="text"
                      maxLength={32}
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value.toUpperCase())}
                      placeholder="E.G. VANCE CAPITAL"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-white/10 focus:border-[#c6f36b] text-white text-xs font-mono uppercase outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Field 3: Digital Destination URL / Handle */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c]">
                    NFC Transferred Link / vCard
                  </label>
                  <input
                    type="text"
                    value={customHandle}
                    onChange={(e) => setCustomHandle(e.target.value)}
                    placeholder="uic.studio/@yourname"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141418] border border-white/10 focus:border-[#c6f36b] text-white text-xs font-mono outline-none transition-colors"
                  />
                </div>

                {/* COLOR & MATERIAL MODE TOGGLE */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c]">
                      Finish & Palette Mode
                    </label>
                    <div className="inline-flex rounded-lg bg-white/[0.04] p-0.5 border border-white/10">
                      <button
                        onClick={() => setColorMode("alloy")}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase transition-colors ${
                          colorMode === "alloy"
                            ? "bg-[#c6f36b] text-[#080809] font-bold"
                            : "text-[#90909c] hover:text-white"
                        }`}
                      >
                        Aerospace Alloys
                      </button>
                      <button
                        onClick={() => setColorMode("custom")}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase transition-colors flex items-center gap-1 ${
                          colorMode === "custom"
                            ? "bg-[#c6f36b] text-[#080809] font-bold"
                            : "text-[#90909c] hover:text-white"
                        }`}
                      >
                        <Palette className="w-3 h-3" />
                        <span>Custom Color</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: Predefined Aerospace Alloys */}
                  {colorMode === "alloy" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {(Object.keys(MATERIALS) as MaterialType[]).map((matKey) => {
                        const mat = MATERIALS[matKey];
                        const isSelected = customMaterial === matKey;
                        return (
                          <button
                            key={matKey}
                            onClick={() => setCustomMaterial(matKey)}
                            className={`p-2.5 rounded-xl text-left transition-all border flex items-center justify-between ${
                              isSelected
                                ? "bg-white/[0.08] border-[#c6f36b] shadow-md"
                                : "bg-[#141418] border-white/[0.06] hover:border-white/20"
                            }`}
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-medium text-white block truncate">
                                {mat.name}
                              </span>
                              <span className="text-[10px] font-mono text-[#90909c] block truncate">
                                {mat.weight} &bull; {mat.category.split(" ")[0]}
                              </span>
                            </div>
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0 ml-2 border border-white/20"
                              style={{ backgroundColor: mat.accent }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Mode 2: Custom Color Creator & Curated Palette */
                    <div className="flex flex-col gap-3 mt-1 p-3.5 rounded-2xl bg-[#141418] border border-white/10">
                      {/* Curated Luxury Swatches */}
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#90909c] block mb-2">
                          Select Luxury Palette:
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {LUXURY_PALETTES.map((pal, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setCustomPrimaryColor(pal.primary);
                                setCustomSecondaryColor(pal.secondary);
                                setCustomAccentColor(pal.accent);
                              }}
                              className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 flex flex-col items-center gap-1 transition-colors group"
                              title={pal.name}
                            >
                              <div
                                className="w-full h-4 rounded"
                                style={{
                                  background: `linear-gradient(135deg, ${pal.primary}, ${pal.secondary})`,
                                }}
                              />
                              <span className="text-[9px] font-mono text-[#90909c] truncate max-w-full">
                                {pal.name.split(" ")[0]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Precise Color Pickers */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono text-[#90909c]">Primary</label>
                          <div className="flex items-center gap-1.5 bg-[#0a0a0c] p-1 rounded-lg border border-white/10">
                            <input
                              type="color"
                              value={customPrimaryColor}
                              onChange={(e) => setCustomPrimaryColor(e.target.value)}
                              className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-white truncate">
                              {customPrimaryColor}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono text-[#90909c]">Secondary</label>
                          <div className="flex items-center gap-1.5 bg-[#0a0a0c] p-1 rounded-lg border border-white/10">
                            <input
                              type="color"
                              value={customSecondaryColor}
                              onChange={(e) => setCustomSecondaryColor(e.target.value)}
                              className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-white truncate">
                              {customSecondaryColor}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono text-[#90909c]">Accent</label>
                          <div className="flex items-center gap-1.5 bg-[#0a0a0c] p-1 rounded-lg border border-white/10">
                            <input
                              type="color"
                              value={customAccentColor}
                              onChange={(e) => setCustomAccentColor(e.target.value)}
                              className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-white truncate">
                              {customAccentColor}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CARD SURFACE PATTERN */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] flex items-center justify-between">
                    <span>Card Surface Texture Pattern</span>
                    <span className="text-[10px] text-[#c6f36b] capitalize">{customPattern}</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { id: "none", label: "Clean" },
                      { id: "carbon", label: "Carbon" },
                      { id: "circuit", label: "Circuit" },
                      { id: "honeycomb", label: "Honeycomb" },
                      { id: "hatch", label: "Hatch" },
                    ].map((pat) => (
                      <button
                        key={pat.id}
                        onClick={() => setCustomPattern(pat.id as PatternType)}
                        className={`p-1.5 rounded-xl text-center text-xs font-mono transition-all border ${
                          customPattern === pat.id
                            ? "bg-white/[0.1] border-[#c6f36b] text-white font-bold"
                            : "bg-[#141418] border-white/[0.06] text-[#90909c] hover:text-white"
                        }`}
                      >
                        <Grid className="w-3.5 h-3.5 mx-auto mb-1 text-[#c6f36b]" />
                        <span className="text-[9px] block truncate">{pat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* IMAGE & LOGO UPLOADS */}
                <div className="flex flex-col gap-3 pt-2 border-t border-white/[0.06]">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] flex items-center justify-between">
                    <span>Upload Custom Artwork & Brand Logo</span>
                    <span className="text-[10px] text-[#585863]">PNG / JPG / WEBP</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Background Artwork Upload */}
                    <div className="p-3 rounded-2xl bg-[#141418] border border-white/10 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-white flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-[#c6f36b]" />
                          <span>Card Artwork</span>
                        </span>
                        {customBgImage && (
                          <button
                            onClick={() => setCustomBgImage(null)}
                            className="p-1 rounded hover:bg-white/10 text-red-400"
                            title="Remove Background Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        ref={bgFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBgImageUpload}
                        className="hidden"
                      />

                      {customBgImage ? (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-mono text-[#c6f36b]">
                            &check; Custom Artwork Loaded
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-[#90909c]">Opacity</span>
                            <input
                              type="range"
                              min={20}
                              max={100}
                              value={bgImageOpacity}
                              onChange={(e) => setBgImageOpacity(Number(e.target.value))}
                              className="w-full h-1 bg-white/20 rounded accent-[#c6f36b]"
                            />
                            <span className="text-[9px] font-mono text-white">{bgImageOpacity}%</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => bgFileInputRef.current?.click()}
                          className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-mono text-[#90909c] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Background</span>
                        </button>
                      )}
                    </div>

                    {/* Brand Logo Upload */}
                    <div className="p-3 rounded-2xl bg-[#141418] border border-white/10 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#c6f36b]" />
                          <span>Brand Logo</span>
                        </span>
                        {customLogo && (
                          <button
                            onClick={() => setCustomLogo(null)}
                            className="p-1 rounded hover:bg-white/10 text-red-400"
                            title="Remove Logo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        ref={logoFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />

                      {customLogo ? (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#c6f36b]">
                            &check; Logo Displayed on Card
                          </span>
                          <button
                            onClick={() => logoFileInputRef.current?.click()}
                            className="text-[10px] font-mono text-[#90909c] underline hover:text-white"
                          >
                            Replace
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => logoFileInputRef.current?.click()}
                          className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-mono text-[#90909c] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Logo / Crest</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Laser Foil Typography Selection */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] flex items-center justify-between">
                    <span>Laser Engraving Foil Finish</span>
                    <span className="text-[10px] text-[#c6f36b] font-medium">
                      {activeFoilConfig.label}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(FOIL_STYLES) as FoilType[]).map((fKey) => {
                      const foil = FOIL_STYLES[fKey];
                      const isSelected = customFoil === fKey;
                      return (
                        <button
                          key={fKey}
                          onClick={() => setCustomFoil(fKey)}
                          className={`p-2 rounded-xl text-center text-xs font-mono transition-all border ${
                            isSelected
                              ? "bg-white/[0.1] border-[#c6f36b] text-white font-bold"
                              : "bg-[#141418] border-white/[0.06] text-[#90909c] hover:text-white"
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full mx-auto mb-1 block"
                            style={{ backgroundColor: foil.hex }}
                          />
                          <span className="text-[10px] block truncate">{foil.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Microchip Hardware Finish */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c]">
                    Hardware Microchip Plating
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "gold", label: "24K Gold" },
                      { id: "silver", label: "Platinum" },
                      { id: "black", label: "Stealth" },
                    ].map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => setCustomChip(ch.id as ChipType)}
                        className={`p-2 rounded-xl text-center text-xs font-mono transition-all border ${
                          customChip === ch.id
                            ? "bg-white/[0.1] border-[#c6f36b] text-white font-bold"
                            : "bg-[#141418] border-white/[0.06] text-[#90909c] hover:text-white"
                        }`}
                      >
                        <Cpu className="w-3.5 h-3.5 mx-auto mb-1 text-[#c6f36b]" />
                        <span className="text-[10px]">{ch.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final Blueprint Commission CTA */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <button
                    onClick={onOpenInquiry}
                    className="w-full rounded-2xl bg-[#c6f36b] hover:bg-[#b5e656] text-[#080809] py-3.5 text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#c6f36b]/20"
                  >
                    <span>Commission This Exact NFC Blueprint</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="block text-center text-[10px] font-mono text-[#585863] mt-2">
                    Includes precision CNC laser-milling &bull; NTAG 424 encryption &bull; Global air courier
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* TAB 2: STUDIO CATALOG (ACETERMITY 3D STACKED EDITIONS) */
          /* ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* LEFT: Aceternity 3D Card Stack */}
            <div className="lg:col-span-7 flex flex-col items-center">
              {/* Interactive Signal Hint */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-[#90909c]">
                  <Radio className="w-3.5 h-3.5 text-[#c6f36b] animate-pulse" />
                  <span>TAP CARD TO SIMULATE NFC TRANSMISSION</span>
                </div>

                {/* Pause/Play Card Cycling */}
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#90909c] hover:text-white transition-colors"
                  title={isAutoPlaying ? "Pause auto-cycling" : "Resume auto-cycling"}
                  aria-label="Toggle card cycle"
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* 3D PERSPECTIVE CONTAINER */}
              <div
                className="relative w-full max-w-[460px] aspect-[1.586/1] cursor-pointer select-none"
                style={{ perspective: "1200px" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleCardTap}
              >
                {/* Stacked Cards Underneath for Depth */}
                {cards.map((c, i) => {
                  const offset = (i - catalogIndex + cards.length) % cards.length;
                  if (offset > 2) return null;

                  const isCurrent = offset === 0;
                  const scale = 1 - offset * 0.05;
                  const translateY = offset * 18;
                  const translateZ = -offset * 40;
                  const opacity = 1 - offset * 0.28;

                  return (
                    <div
                      key={c.id}
                      ref={isCurrent ? cardRef : undefined}
                      className={`absolute inset-0 rounded-[24px] p-7 sm:p-9 flex flex-col justify-between transition-all duration-500 ease-out border shadow-2xl ${
                        isCurrent
                          ? "border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                          : "border-white/5 pointer-events-none"
                      }`}
                      style={{
                        backgroundColor: c.color,
                        transform: isCurrent
                          ? `rotateX(${mousePos.x}deg) rotateY(${mousePos.y}deg) translateZ(0px)`
                          : `translateY(${translateY}px) translateZ(${translateZ}px) scale(${scale})`,
                        opacity,
                        zIndex: 10 - offset,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Metallic sheen texture */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.08] rounded-[24px] pointer-events-none" />

                      {/* NFC Tap Wave Ripple Effect */}
                      {isCurrent && isTapping && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-24 h-24 rounded-full border-2 border-[#c6f36b] animate-ping opacity-75" />
                          <div className="w-40 h-40 rounded-full border border-[#c6f36b]/40 animate-ping opacity-40 delay-100" />
                        </div>
                      )}

                      {/* Card Top: Studio Wordmark & NFC Indicator */}
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs tracking-widest text-[#90909c]">UIC</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c6f36b]" />
                          <span className="text-[10px] font-mono tracking-widest text-white/50">
                            {c.weight}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-white/70 font-mono">
                          <span className="text-[9px] uppercase tracking-widest text-[#90909c]">
                            NTAG 424
                          </span>
                          <Radio className="w-3.5 h-3.5 text-[#c6f36b]" />
                        </div>
                      </div>

                      {/* Card Center: Dynamic Metallic Chip Art */}
                      <div className="relative z-10 flex items-center gap-4 my-auto">
                        <div className="w-11 h-8 rounded-md border border-white/20 bg-gradient-to-br from-amber-200/20 via-yellow-600/20 to-amber-900/30 flex items-center justify-center p-1">
                          <div className="w-full h-full border border-yellow-500/40 rounded flex flex-col justify-around">
                            <div className="h-[1px] bg-yellow-500/40 w-full" />
                            <div className="h-[1px] bg-yellow-500/40 w-full" />
                          </div>
                        </div>
                        <div>
                          <span className="text-xs uppercase font-mono tracking-widest text-white/40 block">
                            ENCRYPTED CREDENTIAL
                          </span>
                          <span className="text-sm font-semibold tracking-wider text-white">
                            DYNAMIC vCARD + URL
                          </span>
                        </div>
                      </div>

                      {/* Card Bottom: Holder Name and Serial */}
                      <div className="relative z-10 flex items-end justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-[#90909c] block">
                            {c.material}
                          </span>
                          <span className="text-base sm:text-lg font-medium text-white tracking-wide">
                            {c.name}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] font-mono tracking-widest text-white/40 block">
                            {c.badge}
                          </span>
                          <span className="text-xs font-mono text-[#c6f36b]">
                            OTA ACTIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tap Simulation Success Banner */}
              {tapSuccess && (
                <div className="mt-8 px-6 py-3 rounded-full bg-[#161619] border border-[#c6f36b]/60 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <ShieldCheck className="w-4 h-4 text-[#c6f36b]" />
                  <span className="text-xs font-mono text-white">
                    SIGNAL VERIFIED: Handshaking with mobile device &bull; 140ms
                  </span>
                </div>
              )}
            </div>

            {/* RIGHT: Material Inspector & Customizer */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="p-8 rounded-2xl bg-[#0d0d10] border border-white/[0.06] flex flex-col gap-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#c6f36b] block mb-2">
                    Active Material Specification
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                    {activeCatalogCard.name}
                  </h3>
                  <p className="mt-3 text-sm text-[#90909c] leading-relaxed font-light">
                    {activeCatalogCard.description}
                  </p>
                </div>

                {/* Technical Attributes */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/[0.06] text-xs font-mono">
                  <div>
                    <span className="text-[#585863] block mb-1">CORE COMPOSITE</span>
                    <span className="text-white font-medium">{activeCatalogCard.material}</span>
                  </div>
                  <div>
                    <span className="text-[#585863] block mb-1">SURFACE TREATMENT</span>
                    <span className="text-white font-medium">{activeCatalogCard.surfaceFinish}</span>
                  </div>
                  <div>
                    <span className="text-[#585863] block mb-1">TARE WEIGHT</span>
                    <span className="text-white font-medium">{activeCatalogCard.weight}</span>
                  </div>
                  <div>
                    <span className="text-[#585863] block mb-1">DATA STANDARD</span>
                    <span className="text-[#c6f36b] font-medium">NFC Forum Type 4</span>
                  </div>
                </div>

                {/* Material Switcher Tabs */}
                <div className="pt-6 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#90909c] block mb-3">
                    Select Alloy / Finish:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {cards.map((c, idx) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setCatalogIndex(idx);
                          setIsAutoPlaying(false);
                        }}
                        className={`px-3 py-2 rounded-xl text-left text-xs font-mono transition-all flex items-center justify-between border ${
                          catalogIndex === idx
                            ? "bg-white/[0.08] border-[#c6f36b] text-white"
                            : "bg-white/[0.02] border-white/[0.06] text-[#90909c] hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{c.name.split(" ")[0]}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full ml-2 flex-shrink-0"
                          style={{ backgroundColor: c.accentColor }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    onClick={() => setActiveTab("creator")}
                    className="w-full rounded-full bg-[#c6f36b] text-[#080809] hover:bg-[#b5e656] py-3 text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Open Live Card Customizer</span>
                  </button>

                  <button
                    onClick={onOpenInquiry}
                    className="w-full rounded-full bg-white/[0.04] text-white hover:bg-white/[0.08] border border-white/10 py-3 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4 text-[#c6f36b]" />
                    <span>Inquire Catalog Edition</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
