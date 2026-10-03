"use client";

import React, { useState, useEffect, useRef } from "react";
import { NfcShowcaseSectionContent, NfcCardItem } from "@/types/content";
import { Play, Pause, Radio, Zap, ShieldCheck, Sparkles, Smartphone } from "lucide-react";

interface NfcShowcaseProps {
  content: NfcShowcaseSectionContent;
  accentColor?: string;
  onOpenInquiry?: () => void;
}

export const NfcShowcase: React.FC<NfcShowcaseProps> = ({
  content,
  accentColor = "#c6f36b",
  onOpenInquiry,
}) => {
  const [cards, setCards] = useState<NfcCardItem[]>(content.cards);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTapping, setIsTapping] = useState(false);
  const [tapSuccess, setTapSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCards(content.cards);
  }, [content.cards]);

  // Automatic cycling timer (Aceternity Card Stack effect)
  useEffect(() => {
    if (!isAutoPlaying || cards.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, cards.length]);

  const activeCard = cards[activeIndex] || cards[0];

  // 3D Perspective Tilt on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({
      x: (y / rect.height) * -22, // rotateX
      y: (x / rect.width) * 22,   // rotateY
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Simulate NFC Tap Interaction
  const handleCardTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setTapSuccess(true);
      setTimeout(() => {
        setIsTapping(false);
        setTimeout(() => setTapSuccess(false), 2400);
      }, 600);
    }, 400);
  };

  return (
    <section id="nfc" className="relative py-28 sm:py-36 px-6 sm:px-8 border-t border-white/[0.06] bg-[#080809] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#c6f36b]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-24">
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
          <p className="text-sm sm:text-base text-[#90909c] max-w-md font-light">
            {content.subtitle}
          </p>
        </div>

        {/* 2-Column Showcase: Interactive 3D Card Stack on Left, Spec & Material Customizer on Right */}
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
                const offset = (i - activeIndex + cards.length) % cards.length;
                if (offset > 2) return null; // Show top 3 in stack

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

                      {/* Chip Active Wave Icon */}
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
                  SIGNAL VERIFIED: Handshaking with mobile device • 140ms
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
                  {activeCard.name}
                </h3>
                <p className="mt-3 text-sm text-[#90909c] leading-relaxed font-light">
                  {activeCard.description}
                </p>
              </div>

              {/* Technical Attributes */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/[0.06] text-xs font-mono">
                <div>
                  <span className="text-[#585863] block mb-1">CORE COMPOSITE</span>
                  <span className="text-white font-medium">{activeCard.material}</span>
                </div>
                <div>
                  <span className="text-[#585863] block mb-1">SURFACE TREATMENT</span>
                  <span className="text-white font-medium">{activeCard.surfaceFinish}</span>
                </div>
                <div>
                  <span className="text-[#585863] block mb-1">TARE WEIGHT</span>
                  <span className="text-white font-medium">{activeCard.weight}</span>
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
                        setActiveIndex(idx);
                        setIsAutoPlaying(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-mono transition-all flex items-center justify-between border ${
                        activeIndex === idx
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

              {/* CTA Button */}
              <button
                onClick={onOpenInquiry}
                className="w-full rounded-full bg-[#c6f36b] text-[#080809] hover:bg-[#b5e656] py-3 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Configure Your Physical NFC Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
