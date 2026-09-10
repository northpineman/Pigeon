"use client";
import { useEffect, useRef, useState } from "react";
import { clamp } from "@/lib/gameData";

export default function SeedBreakerGame({ onFinish, onClose }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState("playing");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const rows = 5, cols = 7;
    const brickW = (W - 20) / cols - 6;
    const brickH = 16;
    const colors = ["#FF7A59", "#FFB100", "#4CAF7D", "#6EC6FF", "#8C6FE0"];
    const bricks = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({ x: 10 + c * (brickW + 6), y: 30 + r * (brickH + 6), w: brickW, h: brickH, alive: true, color: colors[r % colors.length] });
      }
    }

    const s = {
      paddle: { x: W / 2 - 35, w: 70, h: 10, y: H - 24 },
      ball: { x: W / 2, y: H - 40, r: 6, vx: 3, vy: -3.4 },
      bricks,
      launched: false,
    };

    function pointerX(clientX) {
      const rect = canvas.getBoundingClientRect();
      return (clientX - rect.left) * (W / rect.width);
    }
    function onMove(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = pointerX(clientX);
      s.paddle.x = clamp(x - s.paddle.w / 2, 0, W - s.paddle.w);
    }
    function onTap() {
      if (!s.launched) s.launched = true;
    }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("mousedown", onTap);
    canvas.addEventListener("touchstart", onTap, { passive: true });

    let localScore = 0, localLives = 3, done = false;

    function drawRoundRect(x, y, w, h, r) {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
      ctx.fill();
    }

    function loop() {
      if (done) return;
      ctx.fillStyle = "#241B3A";
      ctx.fillRect(0, 0, W, H);

      s.bricks.forEach((b) => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        drawRoundRect(b.x, b.y, b.w, b.h, 4);
      });

      ctx.fillStyle = "#FFF3DC";
      drawRoundRect(s.paddle.x, s.paddle.y, s.paddle.w, s.paddle.h, 5);

      if (s.launched) {
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;
      } else {
        s.ball.x = s.paddle.x + s.paddle.w / 2;
        s.ball.y = s.paddle.y - s.ball.r - 2;
      }

      if (s.ball.x < s.ball.r || s.ball.x > W - s.ball.r) s.ball.vx *= -1;
      if (s.ball.y < s.ball.r) s.ball.vy *= -1;

      if (
        s.ball.y + s.ball.r >= s.paddle.y &&
        s.ball.y + s.ball.r <= s.paddle.y + s.paddle.h &&
        s.ball.x >= s.paddle.x &&
        s.ball.x <= s.paddle.x + s.paddle.w &&
        s.ball.vy > 0
      ) {
        const hitPos = (s.ball.x - (s.paddle.x + s.paddle.w / 2)) / (s.paddle.w / 2);
        s.ball.vx = hitPos * 4.5;
        s.ball.vy = -Math.abs(s.ball.vy);
      }

      for (const b of s.bricks) {
        if (!b.alive) continue;
        if (s.ball.x + s.ball.r > b.x && s.ball.x - s.ball.r < b.x + b.w && s.ball.y + s.ball.r > b.y && s.ball.y - s.ball.r < b.y + b.h) {
          b.alive = false;
          s.ball.vy *= -1;
          localScore += 10;
          setScore(localScore);
          break;
        }
      }

      if (s.ball.y > H + 20) {
        localLives -= 1;
        setLives(localLives);
        s.launched = false;
        s.ball.vx = 3;
        s.ball.vy = -3.4;
        if (localLives <= 0) {
          done = true;
          setStatus("lost");
        }
      }

      if (!done && s.bricks.every((b) => !b.alive)) {
        done = true;
        setStatus("won");
      }

      ctx.fillStyle = "#FFB100";
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI * 2);
      ctx.fill();

      if (!done) rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      done = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("mousedown", onTap);
      canvas.removeEventListener("touchstart", onTap);
    };
  }, []);

  useEffect(() => {
    if (status === "won" || status === "lost") {
      const winBonus = status === "won" ? 25 : 0;
      onFinish(Math.floor(score / 10) + winBonus, status === "won");
    }
  }, [status]); // eslint-disable-line

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px 8px", fontWeight: 800, fontSize: 13 }}>
        <span>Score: {score}</span>
        <span>Lives: {"❤️".repeat(Math.max(lives, 0))}</span>
      </div>
      <canvas ref={canvasRef} width={300} height={380} style={{ width: "100%", maxWidth: 300, borderRadius: 16, touchAction: "none" }} />
      {status === "playing" && <div style={{ fontSize: 11, color: "#8a7a72", marginTop: 6 }}>Tap or click to launch the ball · drag to move the paddle</div>}
      {status !== "playing" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 8 }}>{status === "won" ? "Loft cleared! 🎉" : "Out of tries!"}</div>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}
