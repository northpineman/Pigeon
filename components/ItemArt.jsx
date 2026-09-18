"use client";
import { useId } from "react";

export default function ItemArt({ itemKey, emoji = "✦", size = 96, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const sky = `sky-${uid}`;
  const shine = `shine-${uid}`;
  const common = (
    <>
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfdff" />
          <stop offset="1" stopColor="#edf2fb" />
        </linearGradient>
        <radialGradient id={shine} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="116" height="116" rx="22" fill={`url(#${sky})`} stroke="#d7d2e1" strokeWidth="2" />
      <ellipse cx="60" cy="91" rx="43" ry="13" fill="#635d78" opacity=".10" />
      <circle cx="30" cy="25" r="18" fill={`url(#${shine})`} opacity=".6" />
    </>
  );

  let art = null;
  switch (itemKey) {
    case "mats":
      art = <g><ellipse cx="60" cy="78" rx="38" ry="20" fill="#c87978" stroke="#7b5c57" strokeWidth="3"/><ellipse cx="60" cy="73" rx="32" ry="14" fill="#f0c7b6"/><path d="M34 69 Q45 57 58 66 T86 67" fill="none" stroke="#fff6e9" strokeWidth="5" strokeLinecap="round"/><circle cx="49" cy="78" r="3" fill="#fff4d9"/><circle cx="71" cy="78" r="3" fill="#fff4d9"/></g>;
      break;
    case "bath":
      art = <g><path d="M27 63 H93 L87 90 Q84 99 72 99 H48 Q36 99 33 90Z" fill="#d9eef0" stroke="#6f7f7d" strokeWidth="3"/><path d="M29 64 Q43 53 57 63 T89 62" fill="#fff" stroke="#aadce3" strokeWidth="4"/><circle cx="42" cy="49" r="8" fill="#f8fbff" stroke="#b8dfe5" strokeWidth="2"/><circle cx="63" cy="44" r="6" fill="#f8fbff" stroke="#b8dfe5" strokeWidth="2"/><circle cx="77" cy="52" r="10" fill="#f8fbff" stroke="#b8dfe5" strokeWidth="2"/><path d="M83 34 v23" stroke="#8c7964" strokeWidth="4"/><path d="M82 35 h13 v10" fill="none" stroke="#8c7964" strokeWidth="4" strokeLinecap="round"/></g>;
      break;
    case "toy-basket":
      art = <g><path d="M29 58 H91 L85 96 H35Z" fill="#b77e52" stroke="#76533c" strokeWidth="3"/><path d="M36 63 H84 M34 74 H86 M32 85 H88" stroke="#e8c28b" strokeWidth="4"/><circle cx="44" cy="50" r="13" fill="#e98a85" stroke="#815d57" strokeWidth="2"/><circle cx="71" cy="48" r="12" fill="#7db49b" stroke="#5c7b68" strokeWidth="2"/><path d="M75 47 q8 -12 15 0" fill="none" stroke="#86684d" strokeWidth="4"/><path d="M41 49 l6 -6 M41 49 l-7 -4" stroke="#fff2d9" strokeWidth="2"/></g>;
      break;
    case "vine":
      art = <g><path d="M27 89 Q30 43 60 41 Q90 43 93 89" fill="none" stroke="#6f9770" strokeWidth="13" strokeLinecap="round"/><path d="M35 88 Q38 54 60 52 Q82 54 85 88" fill="none" stroke="#b9d69b" strokeWidth="6" strokeLinecap="round"/><path d="M36 52 q-11 -12 -18 -1 M83 55 q12 -14 20 -3" fill="none" stroke="#537853" strokeWidth="4"/><circle cx="21" cy="49" r="4" fill="#e6afc0"/><circle cx="101" cy="49" r="4" fill="#f0cf78"/></g>;
      break;
    case "chimes":
      art = <g><path d="M60 28 v15" stroke="#725b43" strokeWidth="4"/><path d="M39 45 Q60 33 81 45 L76 55 H44Z" fill="#d3a84b" stroke="#7e653a" strokeWidth="3"/><path d="M48 55 v28 M60 55 v34 M72 55 v28" stroke="#967846" strokeWidth="3"/><path d="M43 82 q5 12 10 0 M55 88 q5 12 10 0 M67 82 q5 12 10 0" fill="#f2cb67" stroke="#7e653a" strokeWidth="2"/><circle cx="48" cy="93" r="3" fill="#c87978"/><circle cx="60" cy="100" r="3" fill="#7fa18b"/><circle cx="72" cy="93" r="3" fill="#8c7ab0"/></g>;
      break;
    case "rainbow":
      art = <g><path d="M31 43 q9 -10 20 -6 l9 5 9 -5 q11 -4 20 6 l9 13 -11 11 -7 -8 v36 H40 V59 l-7 8 -11 -11Z" fill="#efe3c4" stroke="#765f50" strokeWidth="3"/><path d="M43 58 h34" stroke="#dc7877" strokeWidth="6"/><path d="M41 68 h38" stroke="#e3b85f" strokeWidth="6"/><path d="M41 78 h38" stroke="#83aa82" strokeWidth="6"/><path d="M41 88 h38" stroke="#7f8eb4" strokeWidth="6"/></g>;
      break;
    case "potion":
      art = <g><path d="M49 33 h22 v13 l10 13 v28 q0 10 -10 10H49q-10 0-10-10V59l10-13Z" fill="#b5d8ea" stroke="#6d6d79" strokeWidth="3"/><path d="M43 70 H77 V89 Q77 94 70 94H50Q43 94 43 89Z" fill="#cf7eaa"/><rect x="48" y="29" width="24" height="9" rx="3" fill="#86664b"/><circle cx="54" cy="75" r="4" fill="#fff" opacity=".6"/><circle cx="68" cy="82" r="3" fill="#fff" opacity=".55"/><path d="M60 58 v24 M51 70 h18" stroke="#fff0f6" strokeWidth="3"/></g>;
      break;
    case "book":
      art = <g><path d="M28 45 q16 -8 31 2 v49 q-16 -9 -31 -2Z" fill="#7288a8" stroke="#5d5261" strokeWidth="3"/><path d="M92 45 q-16 -8 -31 2 v49 q16 -9 31 -2Z" fill="#8f7bb1" stroke="#5d5261" strokeWidth="3"/><path d="M60 47 v49" stroke="#4f4854" strokeWidth="3"/><path d="M36 59 h15 M36 68 h16 M69 59 h15 M68 68 h16" stroke="#e9e0c9" strokeWidth="3" strokeLinecap="round"/><circle cx="60" cy="40" r="5" fill="#f0c961"/></g>;
      break;
    case "pack-small":
    case "pack-medium":
    case "pack-large": {
      const big = itemKey === "pack-large";
      const mid = itemKey === "pack-medium";
      art = <g><path d={big ? "M28 54 Q60 42 92 54 L87 98 H33Z" : mid ? "M34 46 Q60 39 86 46 L82 98 H38Z" : "M40 49 Q60 44 80 49 L77 95 H43Z"} fill="#d5b878" stroke="#765e45" strokeWidth="3"/><path d="M42 51 q18 8 36 0" fill="none" stroke="#f5e3b0" strokeWidth="4"/><path d="M45 63 q15 14 30 0" fill="none" stroke="#916f45" strokeWidth="2"/><path d="M53 74 q7 -14 14 0 q-7 13 -14 0Z" fill="#d9a840"/><path d="M60 72 v-9" stroke="#6f8d57" strokeWidth="2"/><circle cx="47" cy="38" r="4" fill="#e2bc55"/><circle cx="60" cy="34" r="4" fill="#e2bc55"/><circle cx="74" cy="39" r="4" fill="#e2bc55"/></g>;
      break;
    }
    case "bones-small":
    case "bones-medium":
    case "bones-large":
    case "squeaky-bone":
      art = <g><path d="M41 54 q-10 -12 -18 -3 q-6 8 4 15 q-10 8 -3 16 q8 9 18 -3 l36 -24 q10 11 18 3 q7 -8 -3 -16 q10 -8 3 -16 q-8 -9 -18 3Z" fill="#f3e5bd" stroke="#927a53" strokeWidth="3"/><circle cx="57" cy="65" r="5" fill="#d4aa52" opacity=".7"/>{itemKey !== "squeaky-bone" && <><circle cx="33" cy="94" r="4" fill="#f0c75c"/><circle cx="86" cy="92" r="4" fill="#f0c75c"/></>}</g>;
      break;
    case "yarn-ball":
      art = <g><circle cx="60" cy="67" r="30" fill="#c27a9d" stroke="#765b6c" strokeWidth="3"/><path d="M37 56 q22 17 47 6 M39 73 q22 -17 43 4 M52 39 q18 25 5 55 M69 40 q-14 26 4 49" fill="none" stroke="#f1c7dc" strokeWidth="3"/><path d="M84 82 q12 6 12 14 q0 8 10 6" fill="none" stroke="#9f6282" strokeWidth="3"/></g>;
      break;
    case "feather-wand":
      art = <g><path d="M34 92 L82 36" stroke="#84674b" strokeWidth="5" strokeLinecap="round"/><path d="M76 42 q-3 -21 14 -22 q5 15 -14 22Z" fill="#7fa6c0" stroke="#5e7180" strokeWidth="2"/><path d="M80 46 q8 -21 23 -14 q-1 17 -23 14Z" fill="#d08ca0" stroke="#8c6570" strokeWidth="2"/><path d="M76 43 q-15 -16 -25 -4 q9 14 25 4Z" fill="#e7c56f" stroke="#8a7652" strokeWidth="2"/><circle cx="33" cy="93" r="7" fill="#c17c74"/></g>;
      break;
    case "meadow-ball":
      art = <g><circle cx="60" cy="67" r="31" fill="#a9cf62" stroke="#5f7f4b" strokeWidth="3"/><path d="M33 54 q27 12 54 0 M33 79 q27 -12 54 0" fill="none" stroke="#f8f0d2" strokeWidth="5"/></g>;
      break;
    case "plush-squirrel":
      art = <g><ellipse cx="61" cy="71" rx="22" ry="28" fill="#a87850" stroke="#6e503c" strokeWidth="3"/><circle cx="59" cy="46" r="18" fill="#b9885e" stroke="#6e503c" strokeWidth="3"/><path d="M47 32 l-8 -8 2 15 M69 32 l9 -8 -3 15" fill="#b9885e" stroke="#6e503c" strokeWidth="3"/><circle cx="53" cy="44" r="2.6" fill="#2e2a2b"/><circle cx="65" cy="44" r="2.6" fill="#2e2a2b"/><path d="M56 51 q4 4 8 0" fill="none" stroke="#5f4236" strokeWidth="2"/><path d="M79 72 q20 -12 14 -31 q-18 2 -19 20" fill="#c38d5d" stroke="#6e503c" strokeWidth="4"/></g>;
      break;
    case "butterfly-ribbon":
      art = <g><path d="M58 58 q-18 -26 -32 -8 q2 19 31 18 M62 58 q18 -26 32 -8 q-2 19 -31 18" fill="#d58db6" stroke="#7d637a" strokeWidth="3"/><path d="M58 70 q-20 3 -23 18 q18 7 25 -8 M62 70 q20 3 23 18 q-18 7 -25 -8" fill="#8ab9c3" stroke="#637b83" strokeWidth="3"/><ellipse cx="60" cy="65" rx="5" ry="18" fill="#7b624e"/><path d="M57 49 q-6 -11 -11 -12 M63 49 q6 -11 11 -12" fill="none" stroke="#7b624e" strokeWidth="2"/><path d="M60 83 q6 8 3 18" fill="none" stroke="#d3a34f" strokeWidth="3"/></g>;
      break;
    case "moon-bear":
      art = <g><circle cx="44" cy="46" r="10" fill="#716c91" stroke="#514c6f" strokeWidth="3"/><circle cx="76" cy="46" r="10" fill="#716c91" stroke="#514c6f" strokeWidth="3"/><circle cx="60" cy="57" r="23" fill="#8d86ad" stroke="#514c6f" strokeWidth="3"/><ellipse cx="60" cy="85" rx="27" ry="18" fill="#8d86ad" stroke="#514c6f" strokeWidth="3"/><circle cx="52" cy="55" r="2.5" fill="#282533"/><circle cx="68" cy="55" r="2.5" fill="#282533"/><path d="M57 64 q3 3 6 0" fill="none" stroke="#413a4f" strokeWidth="2"/><path d="M52 79 q8 -11 18 0 q-2 15 -9 18 q-7 -3 -9 -18Z" fill="#f0d070"/></g>;
      break;
    case "peppermint-jingle":
      art = <g><circle cx="58" cy="67" r="26" fill="#f5efe0" stroke="#8c7059" strokeWidth="3"/><path d="M58 42 A25 25 0 0 1 80 56 L60 68Z" fill="#d85d61"/><path d="M80 56 A25 25 0 0 1 72 86 L60 68Z" fill="#f5efe0"/><path d="M72 86 A25 25 0 0 1 37 76 L60 68Z" fill="#d85d61"/><path d="M37 76 A25 25 0 0 1 58 42 L60 68Z" fill="#f5efe0"/><circle cx="60" cy="68" r="5" fill="#d0a94f"/><path d="M60 42 v-12" stroke="#6b875e" strokeWidth="4"/><path d="M60 32 q10 -10 18 0 q-10 8 -18 0Z" fill="#688d61"/></g>;
      break;
    case "snowflake-tug":
      art = <g><path d="M39 87 Q60 58 81 87" fill="none" stroke="#79aeca" strokeWidth="10" strokeLinecap="round"/><path d="M60 36 v40 M42 46 l36 21 M78 46 L42 67" stroke="#dff3f5" strokeWidth="5" strokeLinecap="round"/><circle cx="60" cy="57" r="6" fill="#fff" stroke="#86b7cc" strokeWidth="2"/><circle cx="37" cy="88" r="10" fill="#b1d7df" stroke="#6f9bb0" strokeWidth="3"/><circle cx="83" cy="88" r="10" fill="#b1d7df" stroke="#6f9bb0" strokeWidth="3"/></g>;
      break;
    case "pumpkin-chew":
      art = <g><ellipse cx="60" cy="70" rx="31" ry="27" fill="#db843f" stroke="#7f593f" strokeWidth="3"/><ellipse cx="48" cy="70" rx="14" ry="25" fill="#ec9a4e"/><ellipse cx="72" cy="70" rx="14" ry="25" fill="#c97236"/><path d="M59 45 q-2 -13 10 -16" fill="none" stroke="#68835d" strokeWidth="6" strokeLinecap="round"/><path d="M67 31 q10 1 13 8 q-9 3 -15 -2" fill="#729262"/></g>;
      break;
    case "xmas-tree":
      art = <g><path d="M60 25 L36 57 H48 L29 82 H50 L40 99 H80 L70 82 H91 L72 57 H84Z" fill="#5f8b66" stroke="#49664f" strokeWidth="3"/><rect x="55" y="96" width="10" height="10" fill="#805c42"/><circle cx="49" cy="61" r="4" fill="#d75f63"/><circle cx="70" cy="74" r="4" fill="#e4bd55"/><circle cx="56" cy="87" r="4" fill="#8ab3c3"/><path d="M60 18 l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Z" fill="#f0c957" stroke="#9a7a36" strokeWidth="2"/></g>;
      break;
    case "xmas-lights":
      art = <g><path d="M24 46 q36 34 72 0" fill="none" stroke="#6b705c" strokeWidth="3"/><path d="M30 50 v10 M42 59 v11 M55 66 v11 M69 67 v11 M82 60 v11 M93 50 v10" stroke="#5c6555" strokeWidth="2"/><g stroke="#7b674f" strokeWidth="1.5"><ellipse cx="30" cy="64" rx="5" ry="7" fill="#e66b72"/><ellipse cx="42" cy="74" rx="5" ry="7" fill="#e8c052"/><ellipse cx="55" cy="81" rx="5" ry="7" fill="#79aa83"/><ellipse cx="69" cy="82" rx="5" ry="7" fill="#8a82ba"/><ellipse cx="82" cy="75" rx="5" ry="7" fill="#70aac2"/><ellipse cx="93" cy="64" rx="5" ry="7" fill="#e887a7"/></g></g>;
      break;
    case "xmas-stockings":
      art = <g><path d="M34 36 h20 v34 q0 13-14 17 q-13 3-18-6 q-4-9 8-12 h4Z" fill="#cf6262" stroke="#7d554d" strokeWidth="3"/><path d="M66 36 h20 v34 q0 13-14 17 q-13 3-18-6 q-4-9 8-12 h4Z" fill="#6d9270" stroke="#56664f" strokeWidth="3"/><path d="M30 36 h28 v10 H30Z M62 36 h28 v10 H62Z" fill="#fff1da" stroke="#8d755b" strokeWidth="2"/></g>;
      break;
    case "xmas-snowman":
      art = <g><circle cx="60" cy="76" r="24" fill="#f4f8f5" stroke="#8ca2a2" strokeWidth="3"/><circle cx="60" cy="47" r="18" fill="#f7fbf8" stroke="#8ca2a2" strokeWidth="3"/><circle cx="54" cy="44" r="2.5" fill="#2e3033"/><circle cx="66" cy="44" r="2.5" fill="#2e3033"/><path d="M60 49 l13 4-13 3Z" fill="#e59045"/><path d="M43 37 h34 M48 34 h24 v-12 H50Z" fill="#574c55" stroke="#3d3940" strokeWidth="2"/><path d="M39 59 q21 10 42 0" fill="none" stroke="#c95762" strokeWidth="5"/><circle cx="60" cy="71" r="3" fill="#5f5758"/><circle cx="60" cy="83" r="3" fill="#5f5758"/></g>;
      break;
    case "xmas-gifts":
      art = <g><rect x="29" y="55" width="38" height="39" rx="3" fill="#c95f65" stroke="#7b554f" strokeWidth="3"/><rect x="64" y="48" width="31" height="46" rx="3" fill="#6f956f" stroke="#576850" strokeWidth="3"/><path d="M48 55 v39 M29 69 h38 M79 48 v46 M64 64 h31" stroke="#f1cf6d" strokeWidth="5"/><path d="M48 55 q-15-11-17 0 q6 7 17 0 q15-11 17 0 q-6 7-17 0 M79 48 q-12-10-14 0 q5 6 14 0 q12-10 14 0 q-5 6-14 0" fill="none" stroke="#f1cf6d" strokeWidth="3"/></g>;
      break;
    case "xmas-cookies":
      art = <g><ellipse cx="60" cy="86" rx="36" ry="10" fill="#d7c5a4" stroke="#806a50" strokeWidth="3"/><circle cx="49" cy="67" r="19" fill="#c98f55" stroke="#7d5d43" strokeWidth="3"/><circle cx="72" cy="63" r="18" fill="#c98f55" stroke="#7d5d43" strokeWidth="3"/><path d="M40 62 q9 -11 18 0 M64 58 q8 -10 16 0" fill="none" stroke="#fff0d8" strokeWidth="3"/><circle cx="46" cy="68" r="2" fill="#5e493b"/><circle cx="54" cy="73" r="2" fill="#5e493b"/><circle cx="69" cy="68" r="2" fill="#5e493b"/><circle cx="77" cy="60" r="2" fill="#5e493b"/></g>;
      break;
    case "xmas-candy":
      art = <g><path d="M52 91 V51 q0-21 17-21 q15 0 15 14 q0 11-11 13 q-8 1-11-7" fill="none" stroke="#f7ead8" strokeWidth="13" strokeLinecap="round"/><path d="M52 88 v-12 M52 66 v-12 M57 43 q4-10 12-10 M68 54 q10 0 13-8" fill="none" stroke="#d45e64" strokeWidth="6" strokeLinecap="round"/></g>;
      break;
    case "xmas-snowflake":
      art = <g><path d="M60 29 v62 M34 44 l52 32 M86 44 34 76 M60 29 l-7 9 M60 29 l7 9 M60 91 l-7-9 M60 91 l7-9 M34 44 l11 1 M34 44 l3 10 M86 44 l-11 1 M86 44 l-3 10 M34 76 l11-1 M34 76 l3-10 M86 76 l-11-1 M86 76 l-3-10" stroke="#7db3c7" strokeWidth="5" strokeLinecap="round"/><circle cx="60" cy="60" r="7" fill="#e8f6f7" stroke="#7db3c7" strokeWidth="2"/></g>;
      break;
    case "hw-pumpkin":
      art = <g><ellipse cx="60" cy="70" rx="32" ry="27" fill="#dd7f36" stroke="#754d38" strokeWidth="3"/><ellipse cx="48" cy="70" rx="14" ry="25" fill="#ef9950"/><ellipse cx="72" cy="70" rx="14" ry="25" fill="#c96e2d"/><path d="M59 44 q-2-13 10-15" fill="none" stroke="#5e7e54" strokeWidth="6"/><path d="M44 66 l8-7 7 8 7-8 10 7-8 5 8 6-12 2-5 8-5-8-12-2 9-6Z" fill="#5c4039" opacity=".88"/></g>;
      break;
    case "hw-cobweb":
      art = <g><path d="M25 29 H95 V98 M25 29 95 98 M60 29 V98 M25 63 H95" fill="none" stroke="#9a94aa" strokeWidth="2.5"/><path d="M38 29 q0 14 12 22 M50 29 q0 7 10 13 M82 98 q-14 0-22-12 M95 83 q-10 0-18-9 M25 48 q14 0 22 11" fill="none" stroke="#9a94aa" strokeWidth="2"/><circle cx="76" cy="58" r="6" fill="#514a57"/><path d="M72 62 l-8 7 M80 62 l8 7 M72 56 l-9-4 M80 56 l9-4" stroke="#514a57" strokeWidth="2"/></g>;
      break;
    case "hw-bats":
      art = <g><g fill="#4a3d51" stroke="#352f39" strokeWidth="2"><path d="M31 53 q10-18 20-5 q9-10 18 0 q10-13 20 5 q-8-2-10 9 q-8-5-17 4 q-8-9-17-4 q-3-11-14-9Z"/><path d="M50 79 q7-12 14-4 q6-7 12 0 q7-8 14 4 q-6-1-7 6 q-6-3-12 3 q-5-6-12-3 q-1-7-9-6Z"/></g><circle cx="56" cy="54" r="1.7" fill="#efbf62"/><circle cx="64" cy="54" r="1.7" fill="#efbf62"/></g>;
      break;
    case "hw-cauldron":
      art = <g><ellipse cx="60" cy="63" rx="32" ry="12" fill="#3e3a46" stroke="#29272d" strokeWidth="3"/><path d="M31 63 q4 35 29 35 q25 0 29-35Z" fill="#48444e" stroke="#29272d" strokeWidth="3"/><path d="M35 61 q25 10 50 0" fill="#7cc17d" stroke="#4e8556" strokeWidth="5"/><circle cx="47" cy="51" r="5" fill="#a4d77e"/><circle cx="65" cy="45" r="7" fill="#8ecf75"/><circle cx="78" cy="54" r="4" fill="#b5df86"/><path d="M39 96 l-8 8 M81 96 l8 8" stroke="#29272d" strokeWidth="5"/></g>;
      break;
    case "hw-tombstone":
      art = <g><path d="M38 95 V53 q0-21 22-21 q22 0 22 21 v42Z" fill="#8b8a8f" stroke="#5e5a61" strokeWidth="3"/><path d="M48 56 h24 M60 47 v20" stroke="#69656c" strokeWidth="4"/><path d="M28 96 h64" stroke="#637957" strokeWidth="8" strokeLinecap="round"/><circle cx="37" cy="91" r="5" fill="#7b965e"/><circle cx="82" cy="91" r="5" fill="#7b965e"/></g>;
      break;
    case "hw-candy":
      art = <g><path d="M31 58 H89 L83 95 H37Z" fill="#7d668d" stroke="#55465e" strokeWidth="3"/><path d="M36 63 H84" stroke="#f1b45c" strokeWidth="5"/><circle cx="46" cy="49" r="9" fill="#ef8c63" stroke="#7e5b50" strokeWidth="2"/><path d="M38 49 31 44 M54 49 61 44" stroke="#d86c64" strokeWidth="4"/><rect x="63" y="43" width="18" height="13" rx="5" fill="#7db597" stroke="#5f7564" strokeWidth="2"/><path d="M63 48 57 44 M81 48 87 44" stroke="#ead583" strokeWidth="4"/></g>;
      break;
    case "hw-cat":
      art = <g><path d="M44 42 l-7-15 16 8 q7-4 14 0 l16-8-7 15 q8 10 5 28 q-3 25-21 25 q-18 0-21-25 q-3-18 5-28Z" fill="#403b46" stroke="#2d2a31" strokeWidth="3"/><ellipse cx="52" cy="55" rx="4" ry="7" fill="#e0c55a"/><ellipse cx="68" cy="55" rx="4" ry="7" fill="#e0c55a"/><path d="M56 66 q4 4 8 0 M41 64 25 59 M42 70 24 73 M79 64 95 59 M78 70 96 73" fill="none" stroke="#aaa0b0" strokeWidth="2"/><path d="M77 82 q16 0 14-15 q-1-9-8-11" fill="none" stroke="#403b46" strokeWidth="7" strokeLinecap="round"/></g>;
      break;
    case "hw-lanterns":
      art = <g><path d="M24 39 q36 25 72 0" fill="none" stroke="#5f604d" strokeWidth="3"/><path d="M34 45 v16 M51 52 v18 M69 52 v18 M86 45 v16" stroke="#6b5d4d" strokeWidth="2"/><g stroke="#765646" strokeWidth="2"><path d="M27 61 h14 l-2 19 H29Z" fill="#e28a4b"/><path d="M44 70 h14 l-2 19 H46Z" fill="#c9666e"/><path d="M62 70 h14 l-2 19 H64Z" fill="#8d72a0"/><path d="M79 61 h14 l-2 19 H81Z" fill="#e3a04f"/></g></g>;
      break;
    default:
      art = <g><circle cx="60" cy="64" r="31" fill="#fffaf0" stroke="#9d8768" strokeWidth="3"/><text x="60" y="75" textAnchor="middle" fontSize="35">{emoji}</text></g>;
  }

  return (
    <svg className={`item-art-svg ${className}`.trim()} viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Item illustration">
      {common}
      {art}
    </svg>
  );
}
