"use client";
import { useEffect, useRef, useState } from "react";
import { clamp } from "@/lib/gameData";

const ROUND_SECONDS = 45;

export default function NestCatchGame({ onFinish, onClose }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [status, setStatus] = useState("playing");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const nest = { x: W / 2, w: 56, h: 20, y: H - 26 };
    let drops = [];
    let frame = 0;
    let localCaught = 0;
    let secondsLeft = ROUND_SECONDS * 60;
    let done = false;

    function pointerX(clientX) {
      const rect = canvas.getBoundingClientRect();
      return (clientX - rect.left) * (W / rect.width);
    }
    function onMove(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      nest.x = clamp(pointerX(clientX), nest.w / 2, W - nest.w / 2);
    }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("touchstart", onMove, { passive: true });

    function spawn() {
      const isBad = Math.random() < 0.28;
      drops.push({ x: 20 + Math.random() * (W - 40), y: -16, isBad, speed: 2.2 + Math.random() * 1.4 });
    }

    function loop() {
      if (done) return;
      frame++;
      secondsLeft -= 1;

      ctx.fillStyle = "#B9E4FF";
      ctx.fillRect(0, 0, W, H);

      const spawnRate = Math.max(22, 42 - Math.floor((ROUND_SECONDS * 60 - secondsLeft) / 90));
      if (frame % spawnRate === 0) spawn();

      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      drops.forEach((d) => {
        d.y += d.speed;
        ctx.fillText(d.isBad ? "🌵" : "🌾", d.x, d.y);

        const withinX = Math.abs(d.x - nest.x) < nest.w / 2;
        const withinY = d.y > nest.y - 10 && d.y < nest.y + nest.h;
        if (!d.hit && withinX && withinY) {
          d.hit = true;
          if (d.isBad) {
            secondsLeft = Math.max(0, secondsLeft - 3 * 60);
          } else {
            localCaught += 1;
            setCaught(localCaught);
          }
        }
      });
      drops = drops.filter((d) => d.y < H + 20);

      ctx.fillStyle = "#8C6FE0";
      ctx.beginPath();
      ctx.ellipse(nest.x, nest.y + nest.h / 2, nest.w / 2, nest.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFF3DC";
      ctx.beginPath();
      ctx.ellipse(nest.x, nest.y + nest.h / 2 - 3, nest.w / 2 - 6, nest.h / 2 - 6, 0, 0, Math.PI * 2);
      ctx.fill();

      if (frame % 20 === 0) setTimeLeft(Math.max(0, Math.ceil(secondsLeft / 60)));

      if (secondsLeft <= 0) {
        done = true;
        setStatus("done");
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      done = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchstart", onMove);
    };
  }, []);

  useEffect(() => {
    if (status === "done") {
      onFinish(Math.max(6, caught * 3), caught >= 20);
    }
  }, [status]); // eslint-disable-line

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px 8px", fontWeight: 800, fontSize: 13 }}>
        <span>Caught: {caught}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={380}
        style={{ width: "100%", maxWidth: 300, borderRadius: 16, touchAction: "none" }}
      />
      {status === "playing" && (
        <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 6 }}>Drag to move the nest · catch 🌾, dodge 🌵 (costs 3s)</div>
      )}
      {status !== "playing" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 8 }}>
            {caught >= 20 ? "Great harvest! 🎉" : "Time's up!"}
          </div>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}
