"use client";

import { useEffect, useRef } from "react";

const COUNT       = 260;
const LINK_DIST   = 110;
const REPULSE_R   = 130;   // wider cursor detection
const MAX_SPEED   = 0.5;
const BASE_SPEED  = 0.13;
const SPRING      = 0.025;
const PULSE_FRAC  = 0.18;
const ORANGE_FRAC = 0.28;

// Orange neon: orange center + orange halo
const ORA_FILL    = "255,120,55";

interface P {
  x: number; y: number;
  vx: number; vy: number;
  tvx: number; tvy: number;
  r: number;
  baseOp: number;
  isOrange: boolean;
  pulse: boolean;
  pulseOffset: number;
  pulseSpeed: number;
  glowT: number;
}

function make(W: number, H: number): P {
  const a   = Math.random() * Math.PI * 2;
  const s   = BASE_SPEED * (0.5 + Math.random() * 0.9);
  const tvx = Math.cos(a) * s;
  const tvy = Math.sin(a) * s;
  const rng = Math.random();
  const r   = rng < 0.45 ? 1.0 : rng < 0.80 ? 1.3 : 1.6;
  return {
    x:           Math.random() * W,
    y:           Math.random() * H,
    vx: tvx, vy: tvy, tvx, tvy,
    r,
    baseOp:      0.20 + Math.random() * 0.08,  // 0.20–0.28
    isOrange:    Math.random() < ORANGE_FRAC,
    pulse:       Math.random() < PULSE_FRAC,
    pulseOffset: Math.random() * Math.PI * 2,
    pulseSpeed:  0.006 + Math.random() * 0.013,
    glowT: 0,
  };
}

export default function WebGLBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, ps: P[] = [];
    const mouse = { x: -9999, y: -9999 };
    let t = 0;

    const init = () => {
      const sec = canvas.parentElement;
      W = canvas.width  = sec?.offsetWidth  ?? window.innerWidth;
      H = canvas.height = sec?.offsetHeight ?? window.innerHeight;
      ps = Array.from({ length: COUNT }, () => make(W, H));
    };

    init();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mouseleave", onLeave);

    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      t++;
      ctx.clearRect(0, 0, W, H);

      // ── Physics ────────────────────────────────────────────────────────────
      for (const p of ps) {
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        p.glowT = dist < REPULSE_R ? Math.max(0, 1 - dist / REPULSE_R) : 0;

        if (dist < REPULSE_R && dist > 0) {
          const strength = ((REPULSE_R - dist) / REPULSE_R) * 0.20;
          p.vx += (dx / dist) * strength;
          p.vy += (dy / dist) * strength;
        }

        p.vx += (p.tvx - p.vx) * SPRING;
        p.vy += (p.tvy - p.vy) * SPRING;

        const spd = Math.hypot(p.vx, p.vy);
        if (spd > MAX_SPEED) { p.vx *= MAX_SPEED / spd; p.vy *= MAX_SPEED / spd; }

        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
      }

      // ── Draw dots ─────────────────────────────────────────────────────────
      // Batch 1: idle particles (ambient neon glow, static shadowBlur)
      for (const p of ps) {
        let op = p.baseOp;
        if (p.pulse) {
          const wave = 0.5 + 0.5 * Math.sin(t * p.pulseSpeed + p.pulseOffset);
          op = 0.18 + wave * 0.20; // 0.18 → 0.38
        }

        const gt = p.glowT;

        if (gt > 0) {
          // LED light-up: dramatic brightness + orange corona
          const litOp = 0.55 + gt * 0.45;  // 0.55 → 1.0
          ctx.shadowBlur  = 6 + gt * 18;    // up to 24px halo
          ctx.shadowColor = `rgba(230,99,36,${(0.4 + gt * 0.6).toFixed(2)})`;
          ctx.fillStyle   = `rgba(255,255,255,${litOp.toFixed(3)})`; // white hot center
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (1 + gt * 0.5), 0, Math.PI * 2);
          ctx.fill();
          // Second pass: orange color on top for tint
          ctx.shadowBlur  = gt * 12;
          ctx.shadowColor = `rgba(230,99,36,${(gt * 0.5).toFixed(2)})`;
          ctx.fillStyle   = `rgba(${ORA_FILL},${(gt * 0.7).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (1 + gt * 0.3), 0, Math.PI * 2);
          ctx.fill();
          continue;
        } else if (p.isOrange) {
          ctx.shadowBlur  = 0;
          ctx.fillStyle   = `rgba(${ORA_FILL},${op.toFixed(3)})`;
        } else {
          ctx.shadowBlur  = 0;
          ctx.fillStyle   = `rgba(27,43,75,${op.toFixed(3)})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Connection lines ───────────────────────────────────────────────────
      ctx.shadowBlur  = 0;
      ctx.shadowColor = "transparent";
      ctx.lineWidth   = 1;

      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const d = Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y);
          if (d < LINK_DIST) {
            const a = 0.20 * (1 - d / LINK_DIST);
            ctx.strokeStyle = `rgba(27,43,75,${a.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }
    };

    tick();

    const onResize = () => init();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",     onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        zIndex:        0,
        display:       "block",
        pointerEvents: "none",
      }}
    />
  );
}
