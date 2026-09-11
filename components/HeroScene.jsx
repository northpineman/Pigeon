"use client";
import { theme } from "@/lib/theme";

export default function HeroScene() {
  const [skyA, skyB, skyC] = theme.sky;

  return (
    <svg viewBox="0 0 1000 220" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyA} />
          <stop offset="55%" stopColor={skyB} />
          <stop offset="100%" stopColor={skyC} />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF6DD" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFF6DD" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.hills} stopOpacity="0.9" />
          <stop offset="100%" stopColor={theme.hills} />
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.05" />
          </feComponentTransfer>
        </filter>
      </defs>

      <rect x="0" y="0" width="1000" height="220" fill="url(#skyGrad)" />
      <circle cx="850" cy="55" r="110" fill="url(#sunGlow)" />
      <circle cx="850" cy="55" r="34" fill="#FFF3D2" opacity="0.9" />

      {/* soft distant clouds */}
      {[[90, 40, 1], [260, 70, 0.7], [520, 35, 0.9], [700, 90, 0.6]].map(([x, y, s], i) => (
        <g key={i} opacity="0.75">
          <ellipse cx={x} cy={y} rx={38 * s} ry={14 * s} fill="#fff" />
          <ellipse cx={x + 26 * s} cy={y - 6 * s} rx={26 * s} ry={11 * s} fill="#fff" />
          <ellipse cx={x - 24 * s} cy={y - 4 * s} rx={22 * s} ry={10 * s} fill="#fff" />
        </g>
      ))}

      {/* rolling hills */}
      <path d="M0,150 C120,110 220,170 360,140 C500,110 600,160 760,130 C860,112 940,140 1000,128 L1000,220 L0,220 Z" fill="url(#hillGrad)" />

      {/* reeds and cattails near the water's edge */}
      <g stroke="#6E8B5A" strokeWidth="2.5" opacity="0.5" strokeLinecap="round">
        <path d="M100,220 Q98,170 106,140" fill="none" />
        <path d="M118,220 Q122,180 112,150" fill="none" />
        <path d="M860,220 Q858,175 868,145" fill="none" />
        <path d="M880,220 Q884,182 874,155" fill="none" />
      </g>
      <ellipse cx="106" cy="136" rx="4" ry="9" fill="#7A5233" opacity="0.55" />
      <ellipse cx="112" cy="146" rx="3.5" ry="8" fill="#7A5233" opacity="0.5" />
      <ellipse cx="868" cy="141" rx="4" ry="9" fill="#7A5233" opacity="0.55" />

      {/* a capybara or two lounging by the water */}
      <g fill="#8a6a4a" opacity="0.5">
        <ellipse cx="130" cy="160" rx="20" ry="11" />
        <circle cx="112" cy="154" r="8" />
        <circle cx="108" cy="149" r="2.2" />
        <circle cx="146" cy="182" r="3.5" opacity="0.35" />
      </g>

      <rect x="0" y="0" width="1000" height="220" filter="url(#grain)" opacity="0.5" />
    </svg>
  );
}
