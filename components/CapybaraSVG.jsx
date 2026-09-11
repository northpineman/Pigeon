"use client";
import { SPECIES, COLOR_HEX, SPECIAL_OVERLAY } from "@/lib/gameData";

export default function CapybaraSVG({ speciesKey, colorKey, stage, size = 76 }) {
  const sp = SPECIES[speciesKey] || SPECIES.rock;
  const col = COLOR_HEX[colorKey] || COLOR_HEX.slate;
  const gradId = `bg-${speciesKey}-${colorKey}-${stage}`;

  const shadingDefs = (
    <defs>
      <radialGradient id={gradId} cx="38%" cy="30%" r="78%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
        <stop offset="55%" stopColor={col.base} stopOpacity="0" />
        <stop offset="100%" stopColor="#2B2534" stopOpacity="0.2" />
      </radialGradient>
    </defs>
  );

  // "egg" stage = expecting/on-the-way, rendered as a swaddled bundle rather
  // than a literal egg since capybaras don't lay eggs.
  if (stage === "egg") {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {shadingDefs}
        <ellipse cx="50" cy="62" rx="27" ry="22" fill={col.accent} stroke="#3D3648" strokeWidth="2" />
        <path d="M 26 58 Q 50 46 74 58" fill="none" stroke={col.wing} strokeWidth="2.4" opacity="0.6" />
        <ellipse cx="50" cy="62" rx="27" ry="22" fill={`url(#${gradId})`} />
        <path d="M 50 40 L 44 50 L 56 50 Z" fill={col.wing} opacity="0.8" />
        <circle cx="34" cy="48" r="2" fill="#FFF3DC" opacity="0.8" />
        <circle cx="66" cy="50" r="1.6" fill="#FFF3DC" opacity="0.7" />
        <circle cx="50" cy="80" r="1.8" fill="#FFF3DC" opacity="0.6" />
      </svg>
    );
  }

  const isBaby = stage === "baby";
  const s = sp.bodyScale * (isBaby ? 0.78 : 1);
  const cx = 52, cy = 64;
  const bodyRx = 25 * s, bodyRy = 15 * s;
  const headW = (isBaby ? 17 : 14) * s, headH = (isBaby ? 15 : 12.5) * s;
  const headCx = cx - bodyRx * 0.95, headCy = cy - bodyRy * 0.25;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {shadingDefs}

      {/* stub legs */}
      <rect x={cx - bodyRx * 0.55 - 3 * s} y={cy + bodyRy - 3} width={6 * s} height={9 * s} rx={2.4 * s} fill="#8a6a4a" />
      <rect x={cx + bodyRx * 0.35 - 3 * s} y={cy + bodyRy - 3} width={6 * s} height={9 * s} rx={2.4 * s} fill="#7a5c3e" />

      {/* body: wide, boxy, low-slung */}
      <rect x={cx - bodyRx} y={cy - bodyRy} width={bodyRx * 2} height={bodyRy * 2} rx={bodyRy} fill={col.base} stroke="#3D3648" strokeWidth="1.4" />

      {/* fur markings, keyed off the species' pattern type */}
      {sp.tail === "belly-patch" && (
        <ellipse cx={cx + 2 * s} cy={cy + bodyRy * 0.5} rx={bodyRx * 0.5} ry={bodyRy * 0.4} fill={col.accent} opacity="0.75" />
      )}
      {sp.tail === "tufted" && (
        <>
          <path d={`M ${cx - 6 * s} ${cy - bodyRy + 2} q 4 -6 8 0`} stroke={col.wing} strokeWidth={2 * s} fill="none" opacity="0.7" strokeLinecap="round" />
          <path d={`M ${cx + 8 * s} ${cy - bodyRy + 2} q 4 -6 8 0`} stroke={col.wing} strokeWidth={2 * s} fill="none" opacity="0.7" strokeLinecap="round" />
        </>
      )}
      {sp.tail === "spotted" && (
        <>
          <circle cx={cx - 4 * s} cy={cy - 2} r={2.2 * s} fill={col.accent} opacity="0.7" />
          <circle cx={cx + 8 * s} cy={cy + 3} r={1.8 * s} fill={col.accent} opacity="0.65" />
          <circle cx={cx + 2 * s} cy={cy + 6} r={1.6 * s} fill={col.accent} opacity="0.6" />
        </>
      )}
      <ellipse cx={cx} cy={cy} rx={bodyRx} ry={bodyRy} fill={`url(#${gradId})`} />
      {SPECIAL_OVERLAY[colorKey] && (
        <ellipse cx={cx} cy={cy} rx={bodyRx * 0.7} ry={bodyRy * 0.6} fill={SPECIAL_OVERLAY[colorKey].color} opacity={SPECIAL_OVERLAY[colorKey].opacity} />
      )}

      {/* neck-ring marking sits at the head/body junction */}
      {sp.tail === "neck-ring" && (
        <path d={`M ${headCx + headW * 0.4} ${headCy + headH * 0.8} A ${headW * 0.6} ${headH * 0.3} 0 0 0 ${headCx + headW * 1.3} ${headCy + headH * 0.9}`} stroke="#2B2730" strokeWidth={2.2 * s} fill="none" strokeLinecap="round" opacity="0.55" />
      )}

      {/* head: blocky and low, capybara-style */}
      <rect x={headCx - headW} y={headCy - headH} width={headW * 2} height={headH * 2} rx={headH * 0.7} fill={col.base} stroke="#3D3648" strokeWidth="1.2" />
      <rect x={headCx - headW} y={headCy - headH} width={headW * 2} height={headH * 2} rx={headH * 0.7} fill={`url(#${gradId})`} />

      {/* face mask marking */}
      {sp.tail === "face-mask" && (
        <ellipse cx={headCx - headW * 0.15} cy={headCy + headH * 0.1} rx={headW * 0.85} ry={headH * 0.55} fill="#2B2730" opacity="0.28" />
      )}

      {/* blunt snout */}
      <ellipse cx={headCx - headW * 0.85} cy={headCy + headH * 0.35} rx={headW * 0.45} ry={headH * 0.42} fill={col.wing} opacity="0.9" />
      <circle cx={headCx - headW * 1.05} cy={headCy + headH * 0.25} r={1.1 * s} fill="#2B2730" opacity="0.6" />
      <circle cx={headCx - headW * 1.05} cy={headCy + headH * 0.5} r={1.1 * s} fill="#2B2730" opacity="0.6" />

      {/* small round ears on top */}
      <circle cx={headCx - headW * 0.3} cy={headCy - headH * 0.85} r={3.2 * s} fill={col.wing} stroke="#3D3648" strokeWidth="1" />
      <circle cx={headCx + headW * 0.5} cy={headCy - headH * 0.85} r={3.2 * s} fill={col.wing} stroke="#3D3648" strokeWidth="1" />

      {/* eyes, set high like a real capybara */}
      <circle cx={headCx - headW * 0.15} cy={headCy - headH * 0.15} r={2.2 * s} fill="#2B2730" />
      <circle cx={headCx + headW * 0.05} cy={headCy - headH * 0.35} r={0.9 * s} fill="#fff" />
      <circle cx={headCx + headW * 0.55} cy={headCy - headH * 0.15} r={2.2 * s} fill="#2B2730" />
      <circle cx={headCx + headW * 0.75} cy={headCy - headH * 0.35} r={0.9 * s} fill="#fff" />
    </svg>
  );
}
