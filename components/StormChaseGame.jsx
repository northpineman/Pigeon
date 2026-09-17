"use client";
import { useEffect, useRef, useState } from "react";
import { clamp } from "@/lib/gameData";
import { sfx } from "@/lib/sfx";
import GameResult from "./GameResult";

export default function StormChaseGame({ onFinish, onClose, onPlayAgain }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [storm, setStorm] = useState(0);
  const [status, setStatus] = useState("playing");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const bird = { x: 66, y: H / 2, r: 9 };
    let bolts = [];
    let frame = 0;
    let localDistance = 0;
    let localStorm = 0;
    let stamina = 100;
    let boosting = false;
    let done = false;

    function pointerY(clientY) {
      const rect = canvas.getBoundingClientRect();
      return (clientY - rect.top) * (H / rect.height);
    }
    function onMove(e) {
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      bird.y = clamp(pointerY(clientY), 14, H - 14);
    }
    function onDown(e) {
      boosting = true;
      onMove(e);
    }
    function onUp() {
      boosting = false;
    }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    function spawnBolt() {
      bolts.push({ x: 90 + Math.random() * (W - 110), y: -20, vy: 3.4 + Math.random() * 1.6 });
    }

    function loop() {
      if (done) return;
      frame++;
      localDistance += 1;

      const canBoost = boosting && stamina > 0;
      if (canBoost) stamina = Math.max(0, stamina - 1.4);
      else stamina = Math.min(100, stamina + 0.6);

      const stormRate = canBoost ? 0.06 : 0.14;
      localStorm = clamp(localStorm + stormRate, 0, 100);

      if (frame % 10 === 0) {
        setDistance(Math.floor(localDistance / 6));
        setStorm(Math.round(localStorm));
      }

      // background: storm creeping from the left
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, "#3A2B55");
      g.addColorStop(Math.min(1, localStorm / 100), "#3A2B55");
      g.addColorStop(Math.min(1, localStorm / 100 + 0.001), "#6EC6FF");
      g.addColorStop(1, "#B9E4FF");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      if (frame % Math.max(26, 50 - Math.floor(localDistance / 40)) === 0) spawnBolt();

      ctx.fillStyle = "#FFD86B";
      bolts.forEach((b) => {
        b.y += b.vy;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - 5, b.y + 10);
        ctx.lineTo(b.x + 2, b.y + 10);
        ctx.lineTo(b.x - 4, b.y + 22);
        ctx.lineTo(b.x + 8, b.y + 8);
        ctx.lineTo(b.x + 1, b.y + 8);
        ctx.closePath();
        ctx.fill();

        const dx = bird.x - b.x, dy = bird.y - (b.y + 10);
        if (!b.hit && Math.sqrt(dx * dx + dy * dy) < 16) {
          b.hit = true;
          localStorm = clamp(localStorm + 14, 0, 100);
          sfx.hit();
        }
      });
      bolts = bolts.filter((b) => b.y < H + 24);

      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.fillStyle = "#8a6a4a";
      ctx.beginPath();
      ctx.ellipse(0, 1, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#C9A876";
      ctx.beginPath();
      ctx.ellipse(-9, 2, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = canBoost ? "#FF7A59" : "#6E7889";
      ctx.beginPath();
      ctx.arc(1, -6, 2, 0, Math.PI * 2);
      ctx.arc(7, -6, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // stamina bar
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(10, H - 12, 80, 6);
      ctx.fillStyle = "#4CAF7D";
      ctx.fillRect(10, H - 12, 80 * (stamina / 100), 6);

      if (localStorm >= 100) done = true;

      if (done) {
        setStorm(100);
        setStatus("caught");
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
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("touchstart", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  useEffect(() => {
    if (status === "caught") {
      onFinish(Math.max(6, distance), distance >= 40);
      if (distance >= 40) sfx.success();
      else sfx.fail();
    }
  }, [status]); // eslint-disable-line

  const stars = distance >= 40 ? 3 : distance >= 20 ? 2 : distance >= 5 ? 1 : 0;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Distance: {distance}m · Storm: {storm}%</div>
      <div className="game-canvas-wrap">
      <canvas
        ref={canvasRef}
        width={340}
        height={420}
        style={{ width: "100%", maxWidth: 340, borderRadius: 16, touchAction: "none" }}
      />
      </div>
      {status === "playing" && (
        <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 6 }}>
          Drag to steer · hold to boost ahead of the storm (drains stamina)
        </div>
      )}
      {status !== "playing" && (
        <GameResult
          stars={stars}
          title={distance >= 40 ? "Outran the storm! 🎉" : "The storm caught up!"}
          subtitle={`Distance: ${distance}m`}
          onPlayAgain={onPlayAgain}
          onClose={onClose}
        />
      )}
    </div>
  );
}
