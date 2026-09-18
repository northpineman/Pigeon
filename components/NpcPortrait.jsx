"use client";

const MAP = {
  "Miss Marigold": "/art/npcs/premium/marigold.webp",
  Velvet: "/art/npcs/premium/velvet.webp",
  "Captain Button": "/art/npcs/premium/button.webp",
  "Archivist Moon": "/art/npcs/premium/moon.webp",
  Rowan: "/art/npcs/premium/rowan.webp",
  Pippin: "/art/npcs/premium/pippin.webp",
};

export default function NpcPortrait({ name, size = 120, className = "" }) {
  const src = MAP[name];
  if (!src) return <span className={`npc-portrait-fallback ${className}`.trim()} style={{ width: size, height: size }} aria-hidden="true">🐕</span>;
  return (
    <img
      className={`npc-portrait-art npc-portrait-premium ${className}`.trim()}
      src={src}
      alt={`${name} portrait`}
      width={size}
      height={Math.round(size * 1.2)}
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  );
}
