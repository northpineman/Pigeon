"use client";
import { SPECIES, COLOR_HEX, SPECIAL_OVERLAY } from "@/lib/gameData";

export default function PetSVG({ speciesKey, colorKey, stage, size = 76 }) {
  const sp = SPECIES[speciesKey] || SPECIES.rock;
  const col = COLOR_HEX[colorKey] || COLOR_HEX.slate;
  const gradId = `bg-${speciesKey}-${colorKey}-${stage}`;

  const shadingDefs = (
    <defs>
      <radialGradient id={gradId} cx="38%" cy="28%" r="80%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
        <stop offset="55%" stopColor={col.base} stopOpacity="0" />
        <stop offset="100%" stopColor="#2B2534" stopOpacity="0.2" />
      </radialGradient>
    </defs>
  );

  // "egg" stage = expecting/on-the-way, rendered as a swaddled bundle rather
  // than a literal egg since Italian Greyhounds don't lay eggs.
  if (stage === "egg") {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {shadingDefs}
        <ellipse cx="50" cy="62" rx="25" ry="21" fill={col.accent} stroke="#3D3648" strokeWidth="2" />
        <path d="M 27 58 Q 50 47 73 58" fill="none" stroke={col.wing} strokeWidth="2.2" opacity="0.6" />
        <ellipse cx="50" cy="62" rx="25" ry="21" fill={`url(#${gradId})`} />
        <path d="M 50 41 L 44 50 L 56 50 Z" fill={col.wing} opacity="0.8" />
        <circle cx="35" cy="49" r="2" fill="#FFF3DC" opacity="0.8" />
        <circle cx="65" cy="51" r="1.6" fill="#FFF3DC" opacity="0.7" />
        <circle cx="50" cy="79" r="1.8" fill="#FFF3DC" opacity="0.6" />
      </svg>
    );
  }

  const isBaby = stage === "baby";
  const s = sp.bodyScale * (isBaby ? 0.8 : 1);
  const cx = 52, cy = 62;
  const bodyLen = 30 * s, bodyH = 11 * s;
  const legLen = (isBaby ? 12 : 17) * s;
  const headCx = cx - bodyLen * 0.92, headCy = cy - bodyH * 0.9;
  const headLen = (isBaby ? 12 : 15) * s, headH = (isBaby ? 8 : 7) * s;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {shadingDefs}

      {/* thin whip tail, curving up from the rear */}
      <path
        d={`M ${cx + bodyLen * 0.85} ${cy + 2} Q ${cx + bodyLen * 1.25} ${cy - 4} ${cx + bodyLen * 1.15} ${cy - bodyH * 1.6}`}
        stroke={col.base}
        strokeWidth={2.4 * s}
        fill="none"
        strokeLinecap="round"
      />

      {/* four slender legs */}
      <rect x={cx - bodyLen * 0.65} y={cy + bodyH * 0.4} width={3 * s} height={legLen} rx={1.5 * s} fill={col.wing} />
      <rect x={cx - bodyLen * 0.35} y={cy + bodyH * 0.5} width={3 * s} height={legLen * 0.92} rx={1.5 * s} fill="#3D3648" opacity="0.15" />
      <rect x={cx + bodyLen * 0.25} y={cy + bodyH * 0.5} width={3 * s} height={legLen * 0.92} rx={1.5 * s} fill="#3D3648" opacity="0.15" />
      <rect x={cx + bodyLen * 0.5} y={cy + bodyH * 0.4} width={3 * s} height={legLen} rx={1.5 * s} fill={col.wing} />

      {/* body: deep chest, tucked waist, arched back */}
      <path
        d={`M ${cx - bodyLen} ${cy + bodyH * 0.3}
            C ${cx - bodyLen * 1.05} ${cy - bodyH * 0.9}, ${cx - bodyLen * 0.6} ${cy - bodyH * 1.3}, ${cx - bodyLen * 0.2} ${cy - bodyH * 1.1}
            C ${cx + bodyLen * 0.3} ${cy - bodyH * 1.5}, ${cx + bodyLen * 0.85} ${cy - bodyH * 0.7}, ${cx + bodyLen * 0.85} ${cy - bodyH * 0.1}
            C ${cx + bodyLen * 0.85} ${cy + bodyH * 0.7}, ${cx + bodyLen * 0.55} ${cy + bodyH * 0.9}, ${cx + bodyLen * 0.2} ${cy + bodyH * 0.85}
            C ${cx - bodyLen * 0.3} ${cy + bodyH * 1.05}, ${cx - bodyLen * 0.8} ${cy + bodyH * 0.9}, ${cx - bodyLen} ${cy + bodyH * 0.3}
            Z`}
        fill={col.base}
        stroke="#3D3648"
        strokeWidth="1.3"
      />

      {sp.tail === "belly-patch" && (
        <ellipse cx={cx} cy={cy + bodyH * 0.5} rx={bodyLen * 0.35} ry={bodyH * 0.35} fill={col.accent} opacity="0.8" />
      )}
      {sp.tail === "tufted" && (
        <>
          <path d={`M ${cx - bodyLen * 0.6} ${cy - bodyH} q 3 -5 6 0`} stroke={col.wing} strokeWidth={1.8 * s} fill="none" opacity="0.7" strokeLinecap="round" />
          <path d={`M ${cx - bodyLen * 0.35} ${cy - bodyH * 1.15} q 3 -5 6 0`} stroke={col.wing} strokeWidth={1.8 * s} fill="none" opacity="0.7" strokeLinecap="round" />
        </>
      )}
      {sp.tail === "spotted" && (
        <>
          <circle cx={cx - 2 * s} cy={cy - 2} r={1.8 * s} fill={col.accent} opacity="0.7" />
          <circle cx={cx + 10 * s} cy={cy + 2} r={1.5 * s} fill={col.accent} opacity="0.65" />
          <circle cx={cx + 3 * s} cy={cy + 6} r={1.3 * s} fill={col.accent} opacity="0.6" />
        </>
      )}
      <path
        d={`M ${cx - bodyLen} ${cy + bodyH * 0.3}
            C ${cx - bodyLen * 1.05} ${cy - bodyH * 0.9}, ${cx - bodyLen * 0.6} ${cy - bodyH * 1.3}, ${cx - bodyLen * 0.2} ${cy - bodyH * 1.1}
            C ${cx + bodyLen * 0.3} ${cy - bodyH * 1.5}, ${cx + bodyLen * 0.85} ${cy - bodyH * 0.7}, ${cx + bodyLen * 0.85} ${cy - bodyH * 0.1}
            C ${cx + bodyLen * 0.85} ${cy + bodyH * 0.7}, ${cx + bodyLen * 0.55} ${cy + bodyH * 0.9}, ${cx + bodyLen * 0.2} ${cy + bodyH * 0.85}
            C ${cx - bodyLen * 0.3} ${cy + bodyH * 1.05}, ${cx - bodyLen * 0.8} ${cy + bodyH * 0.9}, ${cx - bodyLen} ${cy + bodyH * 0.3}
            Z`}
        fill={`url(#${gradId})`}
      />
      {SPECIAL_OVERLAY[colorKey] && (
        <ellipse cx={cx} cy={cy} rx={bodyLen * 0.6} ry={bodyH * 0.7} fill={SPECIAL_OVERLAY[colorKey].color} opacity={SPECIAL_OVERLAY[colorKey].opacity} />
      )}

      {sp.tail === "neck-ring" && (
        <path d={`M ${headCx + headLen * 0.5} ${headCy + headH * 0.9} A ${headLen * 0.55} ${headH * 0.35} 0 0 0 ${headCx + headLen * 1.6} ${headCy + headH * 1.05}`} stroke="#fff" strokeWidth={2.4 * s} fill="none" strokeLinecap="round" opacity="0.75" />
      )}

      {/* slender neck connecting head to chest */}
      <path
        d={`M ${headCx + headLen * 0.6} ${headCy + headH * 0.6} L ${cx - bodyLen * 0.75} ${cy - bodyH * 0.6} L ${cx - bodyLen * 0.35} ${cy - bodyH * 1.1} L ${headCx + headLen * 0.3} ${headCy - headH * 0.3} Z`}
        fill={col.base}
        stroke="#3D3648"
        strokeWidth="1"
      />

      {/* head: narrow, tapered wedge snout */}
      <path
        d={`M ${headCx + headLen * 0.7} ${headCy - headH}
            Q ${headCx - headLen} ${headCy - headH * 0.3}, ${headCx - headLen * 1.3} ${headCy}
            Q ${headCx - headLen} ${headCy + headH * 0.5}, ${headCx + headLen * 0.7} ${headCy + headH}
            Q ${headCx + headLen * 1.1} ${headCy}, ${headCx + headLen * 0.7} ${headCy - headH} Z`}
        fill={col.base}
        stroke="#3D3648"
        strokeWidth="1.2"
      />
      <path
        d={`M ${headCx + headLen * 0.7} ${headCy - headH}
            Q ${headCx - headLen} ${headCy - headH * 0.3}, ${headCx - headLen * 1.3} ${headCy}
            Q ${headCx - headLen} ${headCy + headH * 0.5}, ${headCx + headLen * 0.7} ${headCy + headH}
            Q ${headCx + headLen * 1.1} ${headCy}, ${headCx + headLen * 0.7} ${headCy - headH} Z`}
        fill={`url(#${gradId})`}
      />

      {sp.tail === "face-mask" && (
        <ellipse cx={headCx - headLen * 0.3} cy={headCy} rx={headLen * 0.85} ry={headH * 0.7} fill="#2B2730" opacity="0.3" />
      )}

      {/* nose tip */}
      <circle cx={headCx - headLen * 1.25} cy={headCy} r={1.6 * s} fill="#2B2730" />

      {/* small folded "rose" ears */}
      <path d={`M ${headCx + headLen * 0.2} ${headCy - headH * 0.8} q ${5 * s} ${-2 * s} ${4 * s} ${6 * s} q ${-4 * s} ${1 * s} ${-6 * s} ${-3 * s} Z`} fill={col.wing} stroke="#3D3648" strokeWidth="0.9" />
      <path d={`M ${headCx + headLen * 0.55} ${headCy - headH * 0.5} q ${5 * s} ${-1 * s} ${5 * s} ${6 * s} q ${-4 * s} ${1 * s} ${-6 * s} ${-4 * s} Z`} fill={col.wing} stroke="#3D3648" strokeWidth="0.9" />

      {/* eye */}
      <circle cx={headCx - headLen * 0.15} cy={headCy - headH * 0.15} r={1.9 * s} fill="#2B2730" />
      <circle cx={headCx - headLen * 0.05} cy={headCy - headH * 0.35} r={0.8 * s} fill="#fff" />
    </svg>
  );
}
