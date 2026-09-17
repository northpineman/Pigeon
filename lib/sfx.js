"use client";
// Tiny Web Audio sound-effect helper — synthesized tones, no audio files,
// so it works offline with zero network requests. Safe to call from
// anywhere; silently no-ops if the browser blocks audio before a user
// gesture has happened.

let ctx = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, duration, type = "sine", startGain = 0.09, delay = 0) {
  const c = getCtx();
  if (!c) return;
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t0 = c.currentTime + delay;
    gain.gain.setValueAtTime(startGain, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  } catch (e) {
    // ignore — audio is a nice-to-have, never block gameplay on it
  }
}

export const sfx = {
  pop: () => tone(660, 0.09, "triangle", 0.07),
  collect: () => tone(880, 0.12, "sine", 0.08),
  success: () => {
    tone(523, 0.12, "sine", 0.08, 0);
    tone(659, 0.12, "sine", 0.08, 0.08);
    tone(784, 0.18, "sine", 0.09, 0.16);
  },
  fail: () => {
    tone(220, 0.18, "sawtooth", 0.06, 0);
    tone(160, 0.24, "sawtooth", 0.06, 0.1);
  },
  hit: () => tone(140, 0.1, "square", 0.05),
  tick: () => tone(440, 0.05, "square", 0.04),
};
