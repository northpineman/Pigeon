"use client";
import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";
import GameResult from "./GameResult";

const LANES = 3;

export default function WindRiderGame({ onFinish, onClose, onPlayAgain }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [score, setScore] = useState(0);
  const [seedsCaught, setSeedsCaught] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState("playing");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const laneW = W / LANES;
    const laneX = (i) => laneW * i + laneW / 2;

    const iggy = { lane: 1, x: laneX(1), y: H - 48 };
    let items = [];
    let frame = 0;
    let speed = 3.2;
    let localScore = 0, localSeeds = 0, localLives = 3;
    let done = false;

    function onTap(e) {
      if (done) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = (clientX - rect.left) * (W / rect.width);
      if (x < W / 2) iggy.lane = Math.max(0, iggy.lane - 1);
      else iggy.lane = Math.min(LANES - 1, iggy.lane + 1);
    }
    canvas.addEventListener("mousedown", onTap);
    canvas.addEventListener("touchstart", onTap, { passive: true });

    function spawn() {
      const lane = Math.floor(Math.random() * LANES);
      const isSeed = Math.random() < 0.45;
      items.push({ lane, y: -20, isSeed });
    }

    function loop() {
      if (done) return;
      frame++;

      ctx.fillStyle = "#3E3350";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      for (let i = 1; i < LANES; i++) {
        ctx.beginPath();
        ctx.moveTo(laneW * i, 0);
        ctx.lineTo(laneW * i, H);
        ctx.stroke();
      }

      speed = 3.2 + Math.min(3.5, localScore * 0.04);
      if (frame % Math.max(28, 55 - Math.floor(localScore / 2)) === 0) spawn();

      iggy.x += (laneX(iggy.lane) - iggy.x) * 0.28;

      items.forEach((it) => {
        it.y += speed;
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(it.isSeed ? "🌾" : "⛈️", laneX(it.lane), it.y);

        const closeY = Math.abs(it.y - iggy.y) < 20;
        const closeLane = it.lane === iggy.lane;
        if (!it.hit && closeY && closeLane) {
          it.hit = true;
          if (it.isSeed) {
            localSeeds += 1;
            localScore += 2;
            setSeedsCaught(localSeeds);
            setScore(localScore);
            sfx.collect();
          } else {
            localLives -= 1;
            setLives(localLives);
            sfx.hit();
            if (localLives <= 0) done = true;
          }
        }
      });
      items = items.filter((it) => it.y < H + 20);

      if (!done) localScore += 0.02;
      if (Math.floor(localScore) !== score && frame % 10 === 0) setScore(Math.floor(localScore));

      ctx.font = "26px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🐕", iggy.x, iggy.y);

      if (done) {
        setStatus("lost");
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      done = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousedown", onTap);
      canvas.removeEventListener("touchstart", onTap);
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (status === "lost") {
      onFinish(Math.max(6, Math.floor(score) + seedsCaught), score >= 20);
      if (score >= 20) sfx.success();
      else sfx.fail();
    }
  }, [status]); // eslint-disable-line

  const stars = score >= 20 ? 3 : score >= 10 ? 2 : score >= 1 ? 1 : 0;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px 8px", fontWeight: 800, fontSize: 13 }}>
        <span>Score: {score}</span>
        <span>Lives: {"❤️".repeat(Math.max(lives, 0))}</span>
      </div>
      <div className="game-canvas-wrap">
      <canvas
        ref={canvasRef}
        width={340}
        height={420}
        style={{ width: "100%", maxWidth: 340, borderRadius: 16, touchAction: "none" }}
      />
      </div>
      {status === "playing" && (
        <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 6 }}>Tap left/right to switch lanes · grab 🌾, dodge ⛈️</div>
      )}
      {status !== "playing" && (
        <GameResult
          stars={stars}
          title={score >= 20 ? "Rode the wind! 🎉" : "Blown off course!"}
          subtitle={`Score: ${score} · ${seedsCaught} seeds caught`}
          onPlayAgain={onPlayAgain}
          onClose={onClose}
        />
      )}
    </div>
  );
}
