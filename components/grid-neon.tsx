"use client";

import { useRef, useEffect } from "react";

const GRID = 64;
type Dir = "h" | "v";

interface Traveler {
  x: number; y: number;
  dir: Dir;
  speed: number;    // px/frame, signed
  tailLen: number;  // streak length in px
}

function spawn(w: number, h: number): Traveler {
  const dir: Dir = Math.random() < 0.5 ? "h" : "v";
  if (dir === "h") {
    // snap to a random horizontal grid line
    const y = Math.floor(Math.random() * (Math.ceil(h / GRID) + 1)) * GRID;
    const right = Math.random() < 0.5;
    return {
      x: right ? -140 : w + 140, y, dir,
      speed:   (right ? 1 : -1) * (0.9 + Math.random() * 2.0),
      tailLen: 55 + Math.random() * 130,
    };
  } else {
    // snap to a random vertical grid line
    const x = Math.floor(Math.random() * (Math.ceil(w / GRID) + 1)) * GRID;
    const down = Math.random() < 0.5;
    return {
      x, y: down ? -140 : h + 140, dir,
      speed:   (down ? 1 : -1) * (0.9 + Math.random() * 2.0),
      tailLen: 55 + Math.random() * 130,
    };
  }
}

export default function GridNeon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const travelers: Traveler[] = [];
    let raf: number;
    let lastSpawn = 0;
    // Cache dimensions — updated only on resize, not read from DOM every frame
    let cW = 0, cH = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      cW = canvas.offsetWidth;
      cH = canvas.offsetHeight;
      canvas.width  = cW * dpr;
      canvas.height = cH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Seed a few travelers to start
    for (let i = 0; i < 3; i++) travelers.push(spawn(cW, cH));

    const frame = (ts: number) => {
      // Skip draw entirely when tab is hidden — saves GPU/CPU
      if (document.hidden) { raf = requestAnimationFrame(frame); return; }
      const w = cW, h = cH;
      ctx.clearRect(0, 0, w, h);

      // Keep up to 4 travelers alive at a time, spawn with a short gap
      if (travelers.length < 4 && ts - lastSpawn > 220) {
        travelers.push(spawn(w, h));
        lastSpawn = ts;
      }

      for (let i = travelers.length - 1; i >= 0; i--) {
        const t = travelers[i];

        // Advance
        if (t.dir === "h") t.x += t.speed;
        else                t.y += t.speed;

        // Cull once fully off-screen (head + tail both gone)
        const buf = t.tailLen + 30;
        const out = t.dir === "h"
          ? (t.speed > 0 ? t.x > w + buf : t.x < -buf)
          : (t.speed > 0 ? t.y > h + buf : t.y < -buf);
        if (out) { travelers.splice(i, 1); continue; }

        // Head = current position; tail = opposite end of streak
        const hx = t.x, hy = t.y;
        const tx = t.dir === "h" ? hx - Math.sign(t.speed) * t.tailLen : hx;
        const ty = t.dir === "v" ? hy - Math.sign(t.speed) * t.tailLen : hy;

        // Fade α to 0 near screen edges so streaks appear/vanish smoothly
        const FZ = 110;
        const edgeA = t.dir === "h"
          ? Math.min(1, Math.max(0, hx) / FZ, Math.max(0, w - hx) / FZ)
          : Math.min(1, Math.max(0, hy) / FZ, Math.max(0, h - hy) / FZ);

        ctx.save();

        // ── Pass 1 : wide outer glow ───────────────────────────────────
        const g1 = t.dir === "h"
          ? ctx.createLinearGradient(tx, hy, hx, hy)
          : ctx.createLinearGradient(hx, ty, hx, hy);
        g1.addColorStop(0,    "rgba(230,99,36,0)");
        g1.addColorStop(0.60, `rgba(230,99,36,${0.30 * edgeA})`);
        g1.addColorStop(1,    `rgba(255,140,55,${0.65 * edgeA})`);

        ctx.shadowColor = "#E66324";
        ctx.shadowBlur  = 18;
        ctx.strokeStyle = g1;
        ctx.lineWidth   = 3.5;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.stroke();

        // ── Pass 2 : thin bright core ──────────────────────────────────
        const g2 = t.dir === "h"
          ? ctx.createLinearGradient(tx, hy, hx, hy)
          : ctx.createLinearGradient(hx, ty, hx, hy);
        g2.addColorStop(0,    "rgba(255,200,110,0)");
        g2.addColorStop(0.50, `rgba(255,200,110,${0.55 * edgeA})`);
        g2.addColorStop(1,    `rgba(255,245,200,${0.98 * edgeA})`);

        ctx.shadowColor = "#ffe8c0";
        ctx.shadowBlur  = 5;
        ctx.strokeStyle = g2;
        ctx.lineWidth   = 1;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.stroke();

        // ── Pass 3 : bright dot at the head ───────────────────────────
        ctx.shadowColor = "#E66324";
        ctx.shadowBlur  = 22;
        ctx.fillStyle   = `rgba(255,210,130,${0.95 * edgeA})`;
        ctx.beginPath(); ctx.arc(hx, hy, 2.2, 0, Math.PI * 2); ctx.fill();

        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        zIndex: 1, pointerEvents: "none", display: "block",
      }}
    />
  );
}
