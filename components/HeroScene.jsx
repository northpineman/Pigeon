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

      {/* distant rooftop silhouettes, dovecote-like */}
      <g fill="#5B4636" opacity="0.28">
        <rect x="80" y="128" width="26" height="30" />
        <polygon points="72,128 118,128 95,108" />
        <rect x="140" y="140" width="20" height="18" />
        <polygon points="134,140 166,140 150,124" />
        <rect x="860" y="132" width="30" height="26" />
        <polygon points="852,132 900,132 876,110" />
        <rect x="920" y="144" width="18" height="14" />
        <polygon points="914,144 944,144 929,130" />
      </g>

      {/* perched birds */}
      <g fill="#4B4560" opacity="0.55">
        <path d="M108 122 q6 -8 14 -2 q4 -6 10 0 q-4 6 -12 6 q-8 2 -12 -4 Z" />
        <path d="M878 118 q5 -7 12 -2 q3 -5 9 0 q-3 5 -10 5 q-7 2 -11 -3 Z" />
      </g>

      <rect x="0" y="0" width="1000" height="220" filter="url(#grain)" opacity="0.5" />
    </svg>
  );
}
