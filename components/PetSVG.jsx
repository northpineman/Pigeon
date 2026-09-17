"use client";
import { useId } from "react";
import { SPECIES, COLOR_HEX, SPECIAL_OVERLAY } from "@/lib/gameData";

export default function PetSVG({ speciesKey, colorKey, stage, outfitKey = null, wardrobeSlots = null, size = 76 }) {
  const sp = SPECIES[speciesKey] || SPECIES.rock;
  const col = COLOR_HEX[colorKey] || COLOR_HEX.slate;
  const reactId = useId().replace(/:/g, "");
  const slots = wardrobeSlots || (outfitKey ? { body: outfitKey } : {});
  const equipped = new Set(Object.values(slots).filter(Boolean));
  const gradId = `bg-${reactId}`;

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
      {equipped.has("ribbon") && (
        <>
          <path d="M 38 47 Q 50 52 62 47" fill="none" stroke="#D85A88" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 50 50 C 43 44 38 46 42 52 C 45 55 49 53 50 50 Z" fill="#F08FB3" stroke="#7D405C" strokeWidth="0.9" />
          <path d="M 50 50 C 57 44 62 46 58 52 C 55 55 51 53 50 50 Z" fill="#F08FB3" stroke="#7D405C" strokeWidth="0.9" />
          <circle cx="50" cy="50" r="2.2" fill="#F7C96B" />
        </>
      )}
      {equipped.has("berry") && (
        <>
          <path d="M 38 47 Q 50 54 62 47 L 61 56 Q 50 63 39 56 Z" fill="#9A526B" stroke="#5B3B49" strokeWidth="1" />
          <path d="M 41 51 Q 50 57 59 51 M 41 54 Q 50 60 59 54" fill="none" stroke="#D98BA3" strokeWidth="1" opacity="0.8" />
        </>
      )}
      {equipped.has("peppermint") && (
        <>
          <path d="M 35 45 Q 50 52 65 45 L 64 62 Q 50 70 36 62 Z" fill="#D94C57" stroke="#73343B" strokeWidth="1.2" />
          <path d="M 39 47 L 61 61 M 45 48 L 64 58 M 36 53 L 55 65" stroke="#FFF6E8" strokeWidth="3" opacity="0.9" />
          <path d="M 38 45 Q 50 52 62 45" fill="none" stroke="#F7D8D2" strokeWidth="1.5" />
          <path d="M 60 40 C 66 34 72 38 68 43 C 64 48 59 45 60 40 Z" fill="#477A4F" stroke="#315238" strokeWidth="1" />
          <path d="M 68 43 C 73 38 78 43 73 47 C 68 50 65 46 68 43 Z" fill="#5C8A57" stroke="#315238" strokeWidth="1" />
          <circle cx="66" cy="43" r="2.5" fill="#D9444D" />
          <path d="M 30 35 C 28 30 32 27 35 30" fill="none" stroke="#F2D4D0" strokeWidth="2" strokeLinecap="round" />
          <path d="M 70 31 C 73 27 77 30 75 34" fill="none" stroke="#F2D4D0" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {equipped.has("blossom") && (
        <>
          <path d="M 35 36 Q 50 24 65 36" fill="none" stroke="#5D8FB5" strokeWidth="2.4" strokeLinecap="round" />
          {[38,47,57,64].map((x,i)=><g key={`blossom-${i}`}><circle cx={x} cy={32+(i%2)*2} r="3.2" fill="#A8CBEA"/><circle cx={x} cy={32+(i%2)*2} r="1.1" fill="#F7D67B"/></g>)}
        </>
      )}
      {equipped.has("snowcap") && (
        <>
          <path d="M 34 39 Q 49 25 65 39 L 62 44 Q 49 34 37 44 Z" fill="#DCEAF3" stroke="#7A9AAD" strokeWidth="1" />
          <path d="M 39 36 Q 50 29 61 37" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="42" cy="34" r="1.2" fill="#8CB7D3"/><circle cx="57" cy="32" r="1.2" fill="#8CB7D3"/>
        </>
      )}
      {equipped.has("pear") && (
        <>
          <path d="M 36 45 Q 50 51 64 45 L 67 65 Q 50 73 33 65 Z" fill="#D4A83A" stroke="#806522" strokeWidth="1.1" />
          <path d="M 50 47 Q 54 40 59 38" fill="none" stroke="#5D7B43" strokeWidth="2" strokeLinecap="round" />
          <path d="M 58 40 Q 64 35 67 40 Q 62 44 58 40 Z" fill="#7EAA5D" />
        </>
      )}
      {equipped.has("dogwood") && (
        <>
          <path d="M 39 46 Q 50 52 61 46" fill="none" stroke="#6F8F5C" strokeWidth="2.4" />
          <path d="M 50 48 Q 46 41 42 40 M 50 48 Q 55 41 59 40" stroke="#6F8F5C" strokeWidth="1.4" fill="none" />
          <circle cx="42" cy="40" r="3.2" fill="#F4F0EA" stroke="#B8A58F"/><circle cx="59" cy="40" r="3.2" fill="#F4F0EA" stroke="#B8A58F"/>
        </>
      )}
      {equipped.has("starlight") && (
        <>
          <path d="M 34 47 Q 50 53 66 47 L 64 67 Q 50 74 36 67 Z" fill="#6C668F" opacity=".9" stroke="#4C486B" />
          {[39,48,58,63].map((x,i)=><path key={`star-${i}`} d={`M ${x} ${54+(i%2)*7} l 1 2 l 2 1 l-2 1 l-1 2 l-1-2 l-2-1 l2-1 Z`} fill="#FFF4B8"/>)}
        </>
      )}
      {equipped.has("firefly") && (
        <>
          {[29,71,34,67].map((x,i)=><circle key={`glow-${i}`} cx={x} cy={31+(i%2)*10} r={i<2?2.5:1.7} fill="#F6D66F" opacity=".85" />)}
          <circle cx="29" cy="31" r="6" fill="#F6D66F" opacity=".12"/><circle cx="71" cy="31" r="6" fill="#F6D66F" opacity=".12"/>
        </>
      )}
    </svg>
  );
}
