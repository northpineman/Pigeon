"use client";
import { useEffect, useState } from "react";

const ROWS = 8;
const COLS = 8;
const TYPES = ["🌻", "🌸", "🌼", "🫐", "🍇"];
const TYPE_BG = {
  "🌻": "#FFB100",
  "🌸": "#FF6FA5",
  "🌼": "#FFF3DC",
  "🫐": "#6EC6FF",
  "🍇": "#8C6FE0",
};

function makeGrid() {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) row.push(TYPES[Math.floor(Math.random() * TYPES.length)]);
    grid.push(row);
  }
  return grid;
}

function floodFind(grid, r, c) {
  const type = grid[r][c];
  if (!type) return [];
  const seen = new Set();
  const stack = [[r, c]];
  const group = [];
  while (stack.length) {
    const [cr, cc] = stack.pop();
    const key = `${cr},${cc}`;
    if (seen.has(key)) continue;
    if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue;
    if (grid[cr][cc] !== type) continue;
    seen.add(key);
    group.push([cr, cc]);
    stack.push([cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]);
  }
  return group;
}

function applyGravityAndCollapse(grid) {
  // gravity: within each column, cells fall to the bottom
  const cols = [];
  for (let c = 0; c < COLS; c++) {
    const vals = [];
    for (let r = 0; r < ROWS; r++) if (grid[r][c]) vals.push(grid[r][c]);
    const col = Array(ROWS - vals.length).fill(null).concat(vals);
    cols.push(col);
  }
  // collapse: empty columns get squeezed out, remaining shift left
  const nonEmpty = cols.filter((col) => col.some((v) => v));
  while (nonEmpty.length < COLS) nonEmpty.push(Array(ROWS).fill(null));

  const next = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) row.push(nonEmpty[c][r]);
    next.push(row);
  }
  return next;
}

function hasMoves(grid) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!grid[r][c]) continue;
      if (c + 1 < COLS && grid[r][c + 1] === grid[r][c]) return true;
      if (r + 1 < ROWS && grid[r + 1][c] === grid[r][c]) return true;
    }
  }
  return false;
}

function isCleared(grid) {
  return grid.every((row) => row.every((v) => !v));
}

export default function BloomBreakerGame({ onFinish, onClose }) {
  const [grid, setGrid] = useState(makeGrid);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("playing");

  const handleClick = (r, c) => {
    if (status !== "playing") return;
    const group = floodFind(grid, r, c);
    if (group.length < 2) return;

    const cleared = grid.map((row) => [...row]);
    group.forEach(([gr, gc]) => (cleared[gr][gc] = null));
    const settled = applyGravityAndCollapse(cleared);

    const gained = group.length * group.length * 2;
    const newScore = score + gained;
    setScore(newScore);
    setGrid(settled);

    if (isCleared(settled)) {
      setStatus("cleared");
    } else if (!hasMoves(settled)) {
      setStatus("stuck");
    }
  };

  const finish = () => {
    const bonus = status === "cleared" ? 40 : 0;
    onFinish(Math.max(6, Math.floor(score / 4) + bonus), status === "cleared");
  };

  useEffect(() => {
    if (status === "cleared" || status === "stuck") finish();
  }, [status]); // eslint-disable-line

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Score: {score}</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 3,
          maxWidth: 300,
          margin: "0 auto",
          background: "#241B3A",
          padding: 6,
          borderRadius: 12,
        }}
      >
        {grid.map((row, r) =>
          row.map((type, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              style={{
                aspectRatio: "1",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                cursor: type ? "pointer" : "default",
                background: type ? TYPE_BG[type] + "33" : "transparent",
                transition: "background 0.15s",
              }}
            >
              {type || ""}
            </div>
          ))
        )}
      </div>
      {status === "playing" && (
        <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 8 }}>
          Tap a group of 2+ matching blooms to clear them · bigger groups score more
        </div>
      )}
      {status !== "playing" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 8 }}>
            {status === "cleared" ? "Board cleared! 🎉" : "No more matches left!"}
          </div>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}
