"use client";

import React from "react";

export const AmbientBackgroundShapes: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {/* ========================================================================= */}
      {/* 1. VIBRANT MULTI-COLOR AMBIENT GLOW MESH (Vibrant in Light Mode) */}
      {/* ========================================================================= */}
      {/* Top right: Indigo / Violet Glow */}
      <div
        className="absolute -top-[10%] -right-[10%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full blur-[120px] opacity-70 dark:opacity-20 animate-morph"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(139, 92, 246, 0.14) 45%, transparent 70%)",
        }}
      />

      {/* Mid left: Cyan / Emerald Glow */}
      <div
        className="absolute top-[35%] -left-[12%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full blur-[130px] opacity-75 dark:opacity-20 animate-morph"
        style={{
          animationDelay: "-5s",
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(16, 185, 129, 0.14) 45%, transparent 70%)",
        }}
      />

      {/* Mid right: Warm Amber / Rose Glow */}
      <div
        className="absolute top-[65%] -right-[8%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full blur-[130px] opacity-65 dark:opacity-15 animate-morph"
        style={{
          animationDelay: "-9s",
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(244, 63, 94, 0.12) 45%, transparent 70%)",
        }}
      />

      {/* Bottom left: Electric Lime / Teal Glow */}
      <div
        className="absolute -bottom-[8%] left-[10%] w-[50vw] h-[50vw] max-w-[680px] max-h-[680px] rounded-full blur-[140px] opacity-70 dark:opacity-20 animate-morph"
        style={{
          animationDelay: "-13s",
          background:
            "radial-gradient(circle, rgba(198, 243, 107, 0.22) 0%, rgba(20, 184, 166, 0.15) 50%, transparent 70%)",
        }}
      />

      {/* ========================================================================= */}
      {/* 2. FLOATING 3D WIREFRAME POLYHEDRA & GEOMETRIES */}
      {/* ========================================================================= */}

      {/* SHAPE A: Rotating Wireframe Icosahedron (Top Right Area) */}
      <div className="absolute top-[18%] right-[4%] sm:right-[7%] w-36 h-36 sm:w-48 sm:h-48 animate-float-slow opacity-60 dark:opacity-30">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full animate-spin-slow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="polyGradA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="polyGradADark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c6f36b" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Icosahedron Outer & Inner Wireframe Lines */}
          <polygon
            points="100,20 170,60 170,140 100,180 30,140 30,60"
            stroke="url(#polyGradA)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            className="dark:stroke-[url(#polyGradADark)]"
          />
          <polygon
            points="100,45 150,75 150,125 100,155 50,125 50,75"
            stroke="url(#polyGradA)"
            strokeWidth="1"
            className="dark:stroke-[url(#polyGradADark)]"
          />
          <line
            x1="100"
            y1="20"
            x2="100"
            y2="45"
            stroke="url(#polyGradA)"
            strokeWidth="1.2"
            className="dark:stroke-[url(#polyGradADark)]"
          />
          <line
            x1="170"
            y1="60"
            x2="150"
            y2="75"
            stroke="url(#polyGradA)"
            strokeWidth="1.2"
            className="dark:stroke-[url(#polyGradADark)]"
          />
          <line
            x1="170"
            y1="140"
            x2="150"
            y2="125"
            stroke="url(#polyGradA)"
            strokeWidth="1.2"
            className="dark:stroke-[url(#polyGradADark)]"
          />
          <line
            x1="100"
            y1="180"
            x2="100"
            y2="155"
            stroke="url(#polyGradA)"
            strokeWidth="1.2"
            className="dark:stroke-[url(#polyGradADark)]"
          />
          <line
            x1="30"
            y1="140"
            x2="50"
            y2="125"
            stroke="url(#polyGradA)"
            strokeWidth="1.2"
            className="dark:stroke-[url(#polyGradADark)]"
          />
          <line
            x1="30"
            y1="60"
            x2="50"
            y2="75"
            stroke="url(#polyGradA)"
            strokeWidth="1.2"
            className="dark:stroke-[url(#polyGradADark)]"
          />

          {/* Cross Facets */}
          <line
            x1="100"
            y1="45"
            x2="150"
            y2="125"
            stroke="url(#polyGradA)"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            className="dark:stroke-[url(#polyGradADark)]"
          />
          <line
            x1="150"
            y1="75"
            x2="50"
            y2="125"
            stroke="url(#polyGradA)"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            className="dark:stroke-[url(#polyGradADark)]"
          />
          <line
            x1="100"
            y1="155"
            x2="50"
            y2="75"
            stroke="url(#polyGradA)"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            className="dark:stroke-[url(#polyGradADark)]"
          />

          {/* Luminous Vertex Nodes */}
          <circle cx="100" cy="20" r="3" fill="#6366f1" className="dark:fill-[#c6f36b]" />
          <circle cx="170" cy="60" r="3" fill="#06b6d4" className="dark:fill-[#38bdf8]" />
          <circle cx="170" cy="140" r="3" fill="#10b981" className="dark:fill-[#c6f36b]" />
          <circle cx="100" cy="180" r="3" fill="#6366f1" className="dark:fill-[#38bdf8]" />
          <circle cx="30" cy="140" r="3" fill="#06b6d4" className="dark:fill-[#c6f36b]" />
          <circle cx="30" cy="60" r="3" fill="#10b981" className="dark:fill-[#38bdf8]" />
        </svg>
      </div>

      {/* SHAPE B: Dual-Axis Gyroscope Aerospace Rings (Mid Left Area) */}
      <div className="absolute top-[48%] left-[2%] sm:left-[5%] w-40 h-40 sm:w-56 sm:h-56 animate-float-reverse opacity-60 dark:opacity-25">
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gyroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="gyroGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c6f36b" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Outer Ring */}
          <g className="animate-spin-slow origin-center">
            <circle
              cx="120"
              cy="120"
              r="95"
              stroke="url(#gyroGrad)"
              strokeWidth="1.5"
              strokeDasharray="12 6 3 6"
              className="dark:stroke-[url(#gyroGradDark)]"
            />
            <circle cx="215" cy="120" r="3.5" fill="#06b6d4" className="dark:fill-[#c6f36b]" />
            <circle cx="25" cy="120" r="2.5" fill="#ec4899" className="dark:fill-[#a855f7]" />
          </g>

          {/* Middle Elliptical Inclined Ring */}
          <g className="animate-spin-reverse-slow origin-center">
            <ellipse
              cx="120"
              cy="120"
              rx="75"
              ry="38"
              transform="rotate(35 120 120)"
              stroke="url(#gyroGrad)"
              strokeWidth="1.2"
              strokeDasharray="6 4"
              className="dark:stroke-[url(#gyroGradDark)]"
            />
            <circle cx="165" cy="95" r="3" fill="#8b5cf6" className="dark:fill-[#38bdf8]" />
          </g>

          {/* Inner Counter-Ring */}
          <g className="animate-spin-slow origin-center">
            <ellipse
              cx="120"
              cy="120"
              rx="55"
              ry="24"
              transform="rotate(-40 120 120)"
              stroke="url(#gyroGrad)"
              strokeWidth="1"
              className="dark:stroke-[url(#gyroGradDark)]"
            />
            <circle cx="120" cy="120" r="5" fill="#06b6d4" className="dark:fill-[#c6f36b]" />
          </g>
        </svg>
      </div>

      {/* SHAPE C: Geometric Faceted Diamond Prism (Lower Right Area) */}
      <div className="absolute top-[75%] right-[5%] sm:right-[9%] w-32 h-32 sm:w-44 sm:h-44 animate-float-drift opacity-60 dark:opacity-25">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full animate-spin-slow"
          style={{ animationDuration: "36s" }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="prismGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#c6f36b" />
            </linearGradient>
          </defs>

          {/* Diamond Polygon Outer */}
          <polygon
            points="80,10 145,55 125,140 35,140 15,55"
            stroke="url(#prismGrad)"
            strokeWidth="1.5"
            className="dark:stroke-[url(#prismGradDark)]"
          />
          {/* Inner Facet Stars */}
          <line
            x1="80"
            y1="10"
            x2="80"
            y2="100"
            stroke="url(#prismGrad)"
            strokeWidth="1"
            className="dark:stroke-[url(#prismGradDark)]"
          />
          <line
            x1="145"
            y1="55"
            x2="80"
            y2="100"
            stroke="url(#prismGrad)"
            strokeWidth="1"
            className="dark:stroke-[url(#prismGradDark)]"
          />
          <line
            x1="125"
            y1="140"
            x2="80"
            y2="100"
            stroke="url(#prismGrad)"
            strokeWidth="1"
            className="dark:stroke-[url(#prismGradDark)]"
          />
          <line
            x1="35"
            y1="140"
            x2="80"
            y2="100"
            stroke="url(#prismGrad)"
            strokeWidth="1"
            className="dark:stroke-[url(#prismGradDark)]"
          />
          <line
            x1="15"
            y1="55"
            x2="80"
            y2="100"
            stroke="url(#prismGrad)"
            strokeWidth="1"
            className="dark:stroke-[url(#prismGradDark)]"
          />

          {/* Facet Nodes */}
          <circle cx="80" cy="10" r="2.5" fill="#f59e0b" />
          <circle cx="145" cy="55" r="2.5" fill="#ef4444" />
          <circle cx="125" cy="140" r="2.5" fill="#8b5cf6" />
          <circle cx="35" cy="140" r="2.5" fill="#8b5cf6" />
          <circle cx="15" cy="55" r="2.5" fill="#f59e0b" />
          <circle cx="80" cy="100" r="3.5" fill="#ef4444" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 3. FLOATING GLASSMORPHIC CAPSULES & GEOMETRIC ACCENTS */}
      {/* ========================================================================= */}

      {/* Glass Pill 1: Cyan-Indigo Shimmer */}
      <div
        className="absolute top-[28%] left-[8%] w-16 h-8 sm:w-24 sm:h-10 rounded-full border border-cyan-400/40 dark:border-white/10 bg-gradient-to-r from-cyan-400/15 via-indigo-400/15 to-transparent backdrop-blur-sm animate-float-drift shadow-sm"
        style={{ animationDuration: "14s" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-[#c6f36b] absolute top-1/2 left-3 -translate-y-1/2" />
      </div>

      {/* Glass Pill 2: Emerald-Lime Glow */}
      <div
        className="absolute top-[58%] right-[12%] w-20 h-9 sm:w-28 sm:h-11 rounded-full border border-emerald-400/40 dark:border-white/10 bg-gradient-to-r from-emerald-400/15 via-lime-400/15 to-transparent backdrop-blur-sm animate-float-slow shadow-sm"
        style={{ animationDuration: "11s" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#c6f36b] absolute top-1/2 right-3 -translate-y-1/2" />
      </div>

      {/* Glass Pill 3: Violet-Rose Sunset */}
      <div
        className="absolute top-[88%] left-[14%] w-18 h-8 sm:w-24 sm:h-10 rounded-full border border-violet-400/40 dark:border-white/10 bg-gradient-to-r from-violet-400/15 via-rose-400/15 to-transparent backdrop-blur-sm animate-float-reverse shadow-sm"
        style={{ animationDuration: "13s" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-[#c6f36b] absolute top-1/2 left-3 -translate-y-1/2" />
      </div>

      {/* Floating Micro-Geometric Crosses & Diamond Nodes */}
      <div className="absolute top-[22%] left-[24%] text-indigo-400 dark:text-white/20 font-mono text-xs animate-float-slow select-none">
        ✦
      </div>
      <div className="absolute top-[38%] right-[22%] text-cyan-400 dark:text-white/20 font-mono text-sm animate-float-reverse select-none">
        ❖
      </div>
      <div className="absolute top-[62%] left-[18%] text-amber-500 dark:text-white/20 font-mono text-xs animate-float-drift select-none">
        ▲
      </div>
      <div className="absolute top-[82%] right-[26%] text-emerald-500 dark:text-white/20 font-mono text-xs animate-float-slow select-none">
        ✦
      </div>
      <div className="absolute top-[92%] left-[30%] text-rose-400 dark:text-white/20 font-mono text-sm animate-float-reverse select-none">
        ◈
      </div>
    </div>
  );
};
