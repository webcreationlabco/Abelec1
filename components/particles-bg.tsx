"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // target velocity (spring easing back to base drift)
  tvx: number;
  tvy: number;
  radius: number;
  // pulse state
  pulse: boolean;
  pulsePhase: number;
  pulseSpeed: number;
  baseOpacity: number;
}

const PARTICLE_COUNT  = 420;
const LINK_DIST       = 150;
const REPULSE_DIST    = 120;
const REPULSE_PUSH    = 60;   // px to push away
const SPRING          = 0.06; // spring easing back to base velocity
const MAX_SPEED       = 1.4;
const BASE_SPEED      = 0.10;
const PULSE_COUNT     = 25;   // how many particles pulse
const NAVY            = "27,43,75"; // #1B2B4B
const GLOW_RADIUS     = 8;

function makeParticle(W: number, H: number, index: number): Particle {
  const speed = BASE_SPEED + Math.random() * 0.15;
  const angle = Math.random() * Math.PI * 2;
  const tvx = Math.cos(angle) * speed;
  const tvy = Math.sin(angle) * speed;
  const rng = Math.random();
  const radius = rng < 0.4 ? 1.5 : rng < 0.75 ? 2.5 : 4.0;
  const pulse = index < PULSE_COUNT;
  return {
    x:           Math.random() * W,
    y:           Math.random() * H,
    vx:          tvx,
    vy:          tvy,
    tvx,
    tvy,
    radius,
    pulse,
    pulsePhase:  Math.random() * Math.PI * 2,
    pulseSpeed:  0.008 + Math.random() * 0.012,
    baseOpacity: 0.22 + Math.random() * 0.18,
  };
}

export default function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const psRef     = useRef<Particle[]>([]);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const init = () => {
      const parent = canvas.parentElement;
      canvas.width  = parent?.offsetWidth  ?? window.innerWidth;
      canvas.height = parent?.offsetHeight ?? window.innerHeight;
      const W = canvas.width;
      const H = canvas.height;
      psRef.current = Array.from(
        { length: PARTICLE_COUNT },
        (_, i) => makeParticle(W, H, i)
      );
    };

    init();

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mouseleave", onLeave);

    const tick = () => {
      const { width: W, height: H } = canvas;
      const { x: mx, y: my } = mouseRef.current;
      const ps = psRef.current;

      ctx.clearRect(0, 0, W, H);

      for (const p of ps) {
        // Pulse phase advance
        if (p.pulse) p.pulsePhase += p.pulseSpeed;

        // Mouse repulsion — push strongly
        const dx   = p.x - mx;
        const dy   = p.y - my;
        const dist = Math.hypot(dx, dy);
        let proximity = 0; // 0..1, 1 = very close to mouse
        if (dist < REPULSE_DIST && dist > 0) {
          proximity = 1 - dist / REPULSE_DIST;
          const pushFactor = proximity * (REPULSE_PUSH / 60);
          p.vx += (dx / dist) * pushFactor;
          p.vy += (dy / dist) * pushFactor;
        }

        // Spring back to base velocity
        p.vx += (p.tvx - p.vx) * SPRING;
        p.vy += (p.tvy - p.vy) * SPRING;

        // Speed cap
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > MAX_SPEED) { p.vx *= MAX_SPEED / spd; p.vy *= MAX_SPEED / spd; }

        // Move & wrap
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;

        // Compute opacity
        let opacity = p.baseOpacity;
        if (p.pulse) {
          const t = (Math.sin(p.pulsePhase) + 1) / 2; // 0..1
          opacity = 0.30 + t * 0.50; // 0.30..0.80
        }
        // Glow brighter near mouse
        const glowBoost = proximity * 0.5;
        opacity = Math.min(1, opacity + glowBoost);

        // Draw glow halo (radial gradient)
        const glowR = GLOW_RADIUS + p.radius * 1.5 + proximity * 6;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grad.addColorStop(0,   `rgba(${NAVY},${(opacity * 0.55).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(${NAVY},${(opacity * 0.18).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(${NAVY},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Draw core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NAVY},${opacity.toFixed(3)})`;
        ctx.fill();
      }

      // Draw connection lines
      ctx.lineWidth = 0.65;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            const alpha = 0.13 * (1 - d / LINK_DIST);
            ctx.strokeStyle = `rgba(${NAVY},${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    const onResize = () => init();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",     onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        zIndex:        0,
        pointerEvents: "none",
        display:       "block",
      }}
    />
  );
}
