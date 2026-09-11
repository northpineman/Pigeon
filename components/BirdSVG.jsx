"use client";
import { SPECIES, COLOR_HEX, SPECIAL_OVERLAY } from "@/lib/gameData";

function FanTail({ count, spreadDeg, length, width, colorA, colorB, originX, originY, scale }) {
  const feathers = [];
  const start = -spreadDeg / 2;
  const step = count > 1 ? spreadDeg / (count - 1) : 0;
  for (let i = 0; i < count; i++) {
    const angle = start + step * i;
    const len = length * scale;
    const w = (width * scale) / 2;
    feathers.push(
      <g key={i} transform={`translate(${originX} ${originY}) rotate(${angle})`}>
        <polygon points={`0,0 ${len},${-w} ${len},${w}`} fill={i % 2 === 0 ? colorA : colorB} stroke="#3D3648" strokeWidth="0.9" />
      </g>
    );
  }
  return <>{feathers}</>;
}

export default function BirdSVG({ speciesKey, colorKey, stage, size = 76 }) {
  const sp = SPECIES[speciesKey] || SPECIES.rock;
  const col = COLOR_HEX[colorKey] || COLOR_HEX.slate;
  const gradId = `bg-${speciesKey}-${colorKey}-${stage}`;

  const shadingDefs = (
    <defs>
      <radialGradient id={gradId} cx="38%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="55%" stopColor={col.base} stopOpacity="0" />
        <stop offset="100%" stopColor="#2B2534" stopOpacity="0.22" />
      </radialGradient>
    </defs>
  );

  if (stage === "egg") {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {shadingDefs}
        <ellipse cx="50" cy="58" rx="26" ry="34" fill={col.accent} stroke="#3D3648" strokeWidth="2" />
        <ellipse cx="50" cy="58" rx="26" ry="34" fill={`url(#${gradId})`} />
        <circle cx="40" cy="46" r="2.6" fill={col.wing} opacity="0.55" />
        <circle cx="60" cy="55" r="2" fill={col.wing} opacity="0.5" />
        <circle cx="46" cy="70" r="1.8" fill={col.wing} opacity="0.5" />
        <circle cx="58" cy="72" r="2.2" fill={col.wing} opacity="0.45" />
      </svg>
    );
  }

  const isBaby = stage === "baby";
  const s = sp.bodyScale * (isBaby ? 0.72 : 1);
  const cx = 50, cy = 60;
  const bodyRx = 22 * s, bodyRy = 18 * s;
  const headR = (isBaby ? 15 : 11.5) * s;
  const headCx = cx - 16 * s, headCy = cy - 16 * s;

  let tailProps;
  switch (sp.tail) {
    case "fan-large": tailProps = { count: 9, spreadDeg: 78, length: 34, width: 9 }; break;
    case "fan-small": tailProps = { count: 5, spreadDeg: 42, length: 24, width: 10 }; break;
    case "short": tailProps = { count: 1, spreadDeg: 0, length: 14, width: 20 }; break;
    case "long-thin": tailProps = { count: 1, spreadDeg: 0, length: 40, width: 6 }; break;
    default: tailProps = { count: 1, spreadDeg: 0, length: 28, width: 11 };
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {shadingDefs}
      <FanTail {...tailProps} colorA={col.wing} colorB={col.base} originX={cx + bodyRx * 0.7} originY={cy + 2} scale={isBaby ? 0.75 : 1} />
      <line x1={cx - 4 * s} y1={cy + bodyRy - 2} x2={cx - 4 * s} y2={cy + bodyRy + 8 * s} stroke="#C97B45" strokeWidth={2 * s} strokeLinecap="round" />
      <line x1={cx + 6 * s} y1={cy + bodyRy - 2} x2={cx + 6 * s} y2={cy + bodyRy + 8 * s} stroke="#C97B45" strokeWidth={2 * s} strokeLinecap="round" />
      <ellipse cx={cx} cy={cy} rx={bodyRx} ry={bodyRy} fill={col.base} stroke="#3D3648" strokeWidth="1.4" />
      <ellipse cx={cx + 3 * s} cy={cy + 1} rx={bodyRx * 0.62} ry={bodyRy * 0.5} fill={col.wing} opacity="0.9" transform={`rotate(-8 ${cx} ${cy})`} />
      <ellipse cx={cx + 4 * s} cy={cy + bodyRy * 0.35} rx={bodyRx * 0.42} ry={bodyRy * 0.38} fill={col.accent} opacity="0.85" />
      <ellipse cx={cx} cy={cy} rx={bodyRx} ry={bodyRy} fill={`url(#${gradId})`} />
      {SPECIAL_OVERLAY[colorKey] && (
        <ellipse cx={headCx + 8 * s} cy={headCy + 10 * s} rx={9 * s} ry={6 * s} fill={SPECIAL_OVERLAY[colorKey].color} opacity={SPECIAL_OVERLAY[colorKey].opacity} />
      )}
      {speciesKey === "ringneck" && (
        <path d={`M ${headCx - 6 * s} ${headCy + 8 * s} A ${9 * s} ${4 * s} 0 0 0 ${headCx + 10 * s} ${headCy + 9 * s}`} stroke="#2B2730" strokeWidth={2.4 * s} fill="none" strokeLinecap="round" />
      )}
      <circle cx={headCx} cy={headCy} r={headR} fill={col.base} stroke="#3D3648" strokeWidth="1.2" />
      <circle cx={headCx} cy={headCy} r={headR} fill={`url(#${gradId})`} />
      <polygon points={`${headCx - headR - 1},${headCy + 1} ${headCx - headR - 9 * s},${headCy - 2 * s} ${headCx - headR - 9 * s},${headCy + 4 * s}`} fill="#E0A24A" stroke="#3D3648" strokeWidth="0.8" />
      <circle cx={headCx - 2 * s} cy={headCy - 2 * s} r={2.4 * s} fill="#2B2730" />
      <circle cx={headCx - 1.2 * s} cy={headCy - 2.8 * s} r={0.9 * s} fill="#fff" />
    </svg>
  );
}
