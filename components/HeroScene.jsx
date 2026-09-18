"use client";

export default function HeroScene() {
  return (
    <svg viewBox="0 0 1400 360" preserveAspectRatio="xMidYMid slice" className="meadow-hero-art" aria-hidden="true">
      <defs>
        <linearGradient id="v29Sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8e7f2"/><stop offset=".52" stopColor="#f4e8d5"/><stop offset="1" stopColor="#f8d7c6"/></linearGradient>
        <linearGradient id="v29HillBack" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b8d1ae"/><stop offset="1" stopColor="#8fb98e"/></linearGradient>
        <linearGradient id="v29HillFront" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#8fbd8b"/><stop offset="1" stopColor="#5f936b"/></linearGradient>
        <linearGradient id="v29Water" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a9d4df"/><stop offset="1" stopColor="#d6e8df"/></linearGradient>
        <radialGradient id="v29Sun"><stop stopColor="#fff9dd" stopOpacity=".95"/><stop offset="1" stopColor="#fff9dd" stopOpacity="0"/></radialGradient>
        <filter id="v29Soft"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="v29Grain"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".035"/></feComponentTransfer></filter>
      </defs>
      <rect width="1400" height="360" fill="url(#v29Sky)"/>
      <circle cx="1135" cy="72" r="145" fill="url(#v29Sun)"/><circle cx="1135" cy="72" r="35" fill="#fff2c8" opacity=".8"/>
      <g fill="#fff" opacity=".55" filter="url(#v29Soft)"><ellipse cx="250" cy="75" rx="105" ry="25"/><ellipse cx="610" cy="45" rx="120" ry="22"/><ellipse cx="960" cy="115" rx="85" ry="18"/></g>
      <path d="M0 220 C130 150 260 175 390 208 S650 245 790 185 S1070 145 1400 205 L1400 360 L0 360Z" fill="url(#v29HillBack)"/>
      <path d="M0 275 C190 205 345 275 510 240 S800 205 965 262 S1210 300 1400 230 L1400 360 L0 360Z" fill="url(#v29HillFront)"/>
      <path d="M520 360 C580 315 640 300 715 305 C795 310 855 340 930 360Z" fill="url(#v29Water)" opacity=".9"/>
      <path d="M0 334 Q230 300 420 328 T830 326 T1400 318 L1400 360 L0 360Z" fill="#5f8d65"/>
      <g opacity=".9">
        <path d="M1050 267 v-76 h95 v76" fill="#f2dfc1" stroke="#795d48" strokeWidth="5"/><path d="M1037 193 l60-46 62 46" fill="#b86f61" stroke="#795d48" strokeWidth="5"/><rect x="1083" y="226" width="28" height="41" rx="3" fill="#8b6a50"/><rect x="1061" y="209" width="22" height="20" fill="#b9d9de" stroke="#795d48" strokeWidth="3"/><rect x="1120" y="209" width="22" height="20" fill="#b9d9de" stroke="#795d48" strokeWidth="3"/>
        <path d="M1145 267 q40-54 90 0" fill="#d8c8a7" stroke="#795d48" strokeWidth="4"/><path d="M1170 267 v-40" stroke="#795d48" strokeWidth="4"/>
      </g>
      <g fill="#4e7f58"><circle cx="1010" cy="223" r="38"/><circle cx="1250" cy="220" r="44"/><circle cx="1290" cy="236" r="34"/></g>
      <g fill="#f4e7d7" opacity=".95"><circle cx="130" cy="302" r="4"/><circle cx="160" cy="316" r="4"/><circle cx="200" cy="293" r="4"/><circle cx="980" cy="306" r="4"/><circle cx="1010" cy="319" r="4"/><circle cx="1330" cy="302" r="4"/></g>
      <g fill="#f4c9d7" opacity=".9"><circle cx="145" cy="302" r="3"/><circle cx="218" cy="311" r="3"/><circle cx="965" cy="318" r="3"/><circle cx="1320" cy="320" r="3"/></g>
      <g stroke="#315e3d" strokeWidth="3" opacity=".65"><path d="M465 360q0-45-12-75"/><path d="M478 360q0-52 10-86"/><path d="M950 360q0-42 12-70"/></g>
      <rect width="1400" height="360" filter="url(#v29Grain)" opacity=".65"/>
    </svg>
  );
}
