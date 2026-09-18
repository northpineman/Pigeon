// Small engraved ornaments; painted destination art remains the visual focus.
const paths = {
  paw: <><ellipse cx="16" cy="21" rx="7" ry="5" /><ellipse cx="7" cy="13" rx="3" ry="4" /><ellipse cx="14" cy="8" rx="3" ry="4" /><ellipse cx="22" cy="9" rx="3" ry="4" /><ellipse cx="27" cy="16" rx="2.5" ry="3.5" /></>,
  seeds: <><path d="M12 29 20 4M15 22 8 18M17 15 25 11" /><ellipse cx="11" cy="17" rx="3" ry="5" transform="rotate(-40 11 17)" /><ellipse cx="23" cy="10" rx="3" ry="5" transform="rotate(40 23 10)" /><ellipse cx="16" cy="10" rx="2.5" ry="4" transform="rotate(-30 16 10)" /></>,
  bone: <path d="m11 10 11 11c4-2 8 1 6 5-1 2-4 3-6 1-3 2-6-1-5-4L7 13c-4 2-7-1-5-4-1-4 4-6 6-3 3-1 6 1 3 4Z" />,
  flower: <><path d="M16 27v-6m0 3c-6-6-10-1-4 2m4-2c6-6 10-1 4 2" /><path d="M16 7c-5-10-12-1-6 3-10 0-8 10 1 8-4 8 8 10 9 2 8 4 11-7 3-9 5-7-5-12-7-4Z" /><circle cx="16" cy="14" r="3" /></>,
  profile: <><circle cx="16" cy="10" r="5" /><path d="M5 28v-4c0-10 22-10 22 0v4Z" /></>,
  award: <><circle cx="16" cy="12" r="8" /><path d="m11 19-3 10 8-4 8 4-3-10M16 7l2 3 4 1-3 3v4l-3-2-3 2v-4l-3-3 4-1Z" /></>,
  archive: <><path d="M4 6h10l2 3 2-3h10v21H18l-2 2-2-2H4ZM16 9v18M8 12h4M8 17h4M20 12h4M20 17h4" /></>,
  bell: <><path d="M6 23c3-3 3-5 3-10 0-10 14-10 14 0 0 5 0 7 3 10ZM13 27c1 3 5 3 6 0M16 3V1" /></>,
  settings: <><path d="M16 3v5m0 16v5M3 16h5m16 0h5M7 7l4 4m10 10 4 4M7 25l4-4m10-10 4-4" /><circle cx="16" cy="16" r="8" /><circle cx="16" cy="16" r="3" /></>,
  exit: <><path d="M13 5H5v22h8M12 16h16m-6-6 6 6-6 6" /></>,
};
export default function MeadowIcon({ name = "flower" }) {
  return <svg className="meadow-engraving" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.flower}</svg>;
}
