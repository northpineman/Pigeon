"use client";
import { useEffect, useRef, useState } from "react";

export default function SkyDashGame({ onFinish, onClose }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("playing");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const bird = { x: 60, y: H / 2, r: 10, vy: 0 };
    const gravity = 0.42;
    const flap = -6.6;
    const pipeW = 44;
    let gapSize = 128;
    let pipeSpeed = 2.6;
    let pipes = [];
    let frame = 0;
    let localScore = 0;
    let done = false;

    function spawnPipe() {
      const margin = 40;
      const gapY = margin + Math.random() * (H - margin * 2 - gapSize);
      pipes.push({ x: W + pipeW, gapY, passed: false });
    }

    function onFlap(e) {
      if (e) e.preventDefault();
      if (done) return;
      bird.vy = flap;
    }
    canvas.addEventListener("mousedown", onFlap);
    canvas.addEventListener("touchstart", onFlap, { passive: false });

    function drawCloud(x, y, s) {
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(x, y, 10 * s, 0, Math.PI * 2);
      ctx.arc(x + 12 * s, y - 4 * s, 8 * s, 0, Math.PI * 2);
      ctx.arc(x - 12 * s, y - 3 * s, 8 * s, 0, Math.PI * 2);
      ctx.fill();
    }

    const bgClouds = Array.from({ length: 5 }, () => ({
      x: Math.random() * W,
      y: 20 + Math.random() * (H - 40),
      s: 0.6 + Math.random() * 0.8,
    }));

    function loop() {
      if (done) return;
      frame++;

      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#6EC6FF");
      g.addColorStop(1, "#B9E4FF");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      bgClouds.forEach((c) => {
        c.x -= pipeSpeed * 0.3;
        if (c.x < -20) c.x = W + 20;
        drawCloud(c.x, c.y, c.s);
      });

      if (frame % 95 === 0) spawnPipe();
      pipeSpeed = 2.6 + Math.min(2.4, localScore * 0.06);
      gapSize = Math.max(92, 128 - localScore * 1.2);

      bird.vy += gravity;
      bird.y += bird.vy;

      ctx.fillStyle = "#4CAF7D";
      pipes.forEach((p) => {
        p.x -= pipeSpeed;
        ctx.fillRect(p.x, 0, pipeW, p.gapY);
        ctx.fillRect(p.x, p.gapY + gapSize, pipeW, H - (p.gapY + gapSize));

        if (!p.passed && p.x + pipeW < bird.x) {
          p.passed = true;
          localScore += 1;
          setScore(localScore);
        }

        const hitX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + pipeW;
        const hitY = bird.y - bird.r < p.gapY || bird.y + bird.r > p.gapY + gapSize;
        if (hitX && hitY) done = true;
      });
      pipes = pipes.filter((p) => p.x > -pipeW);

      if (bird.y - bird.r < 0 || bird.y + bird.r > H) done = true;

      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(Math.max(-0.5, Math.min(0.9, bird.vy * 0.08)));
      ctx.fillStyle = "#FFF3DC";
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFB100";
      ctx.beginPath();
      ctx.moveTo(9, -1);
      ctx.lineTo(17, 0);
      ctx.lineTo(9, 3);
      ctx.fill();
      ctx.fillStyle = "#8C6FE0";
      ctx.beginPath();
      ctx.ellipse(-3, 2, 5, 3.5, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

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
      canvas.removeEventListener("mousedown", onFlap);
      canvas.removeEventListener("touchstart", onFlap);
    };
  }, []);

  useEffect(() => {
    if (status === "lost") {
      onFinish(Math.max(6, score * 3), score >= 8);
    }
  }, [status]); // eslint-disable-line

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Score: {score}</div>
      <canvas
        ref={canvasRef}
        width={300}
        height={380}
        style={{ width: "100%", maxWidth: 300, borderRadius: 16, touchAction: "none" }}
      />
      {status === "playing" && (
        <div style={{ fontSize: 11, color: "#8a7a72", marginTop: 6 }}>Tap or click to flap between the vines</div>
      )}
      {status !== "playing" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 8 }}>
            {score >= 8 ? "Great flying! 🎉" : "Grounded!"}
          </div>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}
