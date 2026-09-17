"use client";

export default function WorldMap({ onEnterHalloween, onEnterChristmas, onGoGames, onGoShop }) {
  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "3px solid var(--frame)", boxShadow: "4px 4px 0 rgba(91,70,54,0.15)" }}>
      <svg viewBox="0 0 800 460" style={{ width: "100%", display: "block" }}>
        <defs>
          <linearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EAE3F7" />
            <stop offset="100%" stopColor="#F3ECDD" />
          </linearGradient>
          <linearGradient id="fallGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8C79A" />
            <stop offset="100%" stopColor="#CFA265" />
          </linearGradient>
          <linearGradient id="winterGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EAF2F7" />
            <stop offset="100%" stopColor="#C9DEEA" />
          </linearGradient>
          <linearGradient id="homeGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D9EFDD" />
            <stop offset="100%" stopColor="#B9DABF" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="800" height="460" fill="url(#mapSky)" />

        {/* winding path connecting the regions */}
        <path d="M120,120 Q260,180 400,150 T680,120 M400,150 Q380,260 400,340" fill="none" stroke="#D8C9A3" strokeWidth="14" strokeLinecap="round" strokeDasharray="2 22" opacity="0.9" />

        {/* ---------------- Fall Grove (left) ---------------- */}
        <g className="map-hotspot" onClick={onEnterHalloween} style={{ cursor: "pointer" }}>
          <ellipse cx="150" cy="130" rx="150" ry="105" fill="url(#fallGround)" stroke="#8a6a3f" strokeWidth="2.5" />
          {[[60, 90], [110, 60], [170, 85], [220, 65]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 4} y={y} width="8" height="26" fill="#7a5233" />
              <circle cx={x} cy={y - 8} r="18" fill={i % 2 ? "#D9863D" : "#C4672E"} />
            </g>
          ))}
          <text x="150" y="55" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="20" fontWeight="700" fill="#5B4636">Fall Grove</text>
          {/* shop stall */}
          <g transform="translate(120,120)">
            <rect x="0" y="10" width="60" height="34" fill="#EFCB8B" stroke="#5B4636" strokeWidth="2" />
            <polygon points="-8,10 68,10 30,-14" fill="#C4672E" stroke="#5B4636" strokeWidth="2" />
            <text x="30" y="32" textAnchor="middle" fontSize="22">🎃</text>
          </g>
          <text x="150" y="185" textAnchor="middle" fontSize="12" fontWeight="700" fill="#5B4636">Halloween Shop · tap to enter</text>
        </g>

        {/* ---------------- Frostpeak Woods (right) ---------------- */}
        <g className="map-hotspot" onClick={onEnterChristmas} style={{ cursor: "pointer" }}>
          <ellipse cx="650" cy="130" rx="150" ry="105" fill="url(#winterGround)" stroke="#7d97ab" strokeWidth="2.5" />
          {[[570, 75], [620, 55], [680, 78], [730, 60]].map(([x, y], i) => (
            <g key={i}>
              <polygon points={`${x},${y - 34} ${x - 16},${y} ${x + 16},${y}`} fill="#6E93BE" />
              <polygon points={`${x},${y - 20} ${x - 12},${y + 12} ${x + 12},${y + 12}`} fill="#89ADD6" />
            </g>
          ))}
          <text x="650" y="55" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="20" fontWeight="700" fill="#3E5670">Frostpeak Woods</text>
          <g transform="translate(620,120)">
            <rect x="0" y="10" width="60" height="34" fill="#F3F7FA" stroke="#3E5670" strokeWidth="2" />
            <polygon points="-8,10 68,10 30,-14" fill="#89ADD6" stroke="#3E5670" strokeWidth="2" />
            <text x="30" y="32" textAnchor="middle" fontSize="22">🎄</text>
          </g>
          <text x="650" y="185" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3E5670">Christmas Shop · tap to enter</text>
        </g>

        {/* ---------------- The Kennel (center, home) ---------------- */}
        <g>
          <ellipse cx="400" cy="330" rx="130" ry="90" fill="url(#homeGround)" stroke="#6a9c78" strokeWidth="2.5" />
          <ellipse cx="400" cy="320" rx="55" ry="26" fill="#A9CDE0" stroke="#5B8AA0" strokeWidth="2" />
          <ellipse cx="380" cy="316" rx="12" ry="7" fill="#8a6a4a" />
          <circle cx="368" cy="311" r="5" fill="#8a6a4a" />
          <text x="400" y="380" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="16" fontWeight="700" fill="#3F6B4B">The Kennel (home)</text>
        </g>

        {/* ---------------- Arcade Lane (bottom left) ---------------- */}
        <g className="map-hotspot" onClick={onGoGames} style={{ cursor: "pointer" }}>
          <ellipse cx="150" cy="370" rx="105" ry="70" fill="#DCE6F9" stroke="#7d8fb0" strokeWidth="2.5" />
          <polygon points="100,360 200,360 190,390 110,390" fill="#F5D3E3" stroke="#5B4636" strokeWidth="2" />
          <text x="150" y="382" textAnchor="middle" fontSize="20">🎮</text>
          <text x="150" y="410" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="15" fontWeight="700" fill="#4B4560">Arcade Lane</text>
        </g>

        {/* ---------------- The Market (bottom right) ---------------- */}
        <g className="map-hotspot" onClick={onGoShop} style={{ cursor: "pointer" }}>
          <ellipse cx="650" cy="370" rx="105" ry="70" fill="#F7DCEA" stroke="#b08398" strokeWidth="2.5" />
          <polygon points="600,360 700,360 690,390 610,390" fill="#E8B563" stroke="#5B4636" strokeWidth="2" />
          <text x="650" y="382" textAnchor="middle" fontSize="20">⭐</text>
          <text x="650" y="410" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="15" fontWeight="700" fill="#4B4560">The Market</text>
        </g>
      </svg>
    </div>
  );
}
