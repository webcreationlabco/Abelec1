"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Shape metadata ───────────────────────────────────────────────────────────
const SHAPES = [
  { label: "Tambour",          sub: "Lave-linge · Sèche-linge"   },
  { label: "Résistance",       sub: "Lave-vaisselle · Four"       },
  { label: "Fer à repasser",   sub: "Traitement du linge"         },
  { label: "Hélice",           sub: "Ventilateur · Climatiseur"   },
] as const;

const N            = 12_000;  // particle count
const MORPH_FRAMES = 70;      // ≈1.2 s at 60 fps
const HOLD_FRAMES  = 230;     // ≈3.8 s hold between morphs

// ── Point generators ─────────────────────────────────────────────────────────
// All shapes roughly centred on origin, fitting within ±24 units.

/** Washing-machine drum: open cylinder with porthole + perforation holes */
function drumPoints(): Float32Array {
  const out = new Float32Array(N * 3);
  const R = 20, D = 22;
  for (let i = 0; i < N; i++) {
    const r = Math.random();
    let x = 0, y = 0, z = 0;
    if (r < 0.28) {
      // Lateral cylinder surface
      const a = Math.random() * Math.PI * 2;
      x = R * Math.cos(a);
      y = R * Math.sin(a);
      z = -Math.random() * D;
    } else if (r < 0.48) {
      // Front opening ring (thick)
      const a  = Math.random() * Math.PI * 2;
      const dr = (Math.random() - 0.5) * 3;
      x = (R + dr) * Math.cos(a);
      y = (R + dr) * Math.sin(a);
      z = (Math.random() - 0.5) * 1.5;
    } else if (r < 0.68) {
      // Inner porthole ring (like the glass seal)
      const a  = Math.random() * Math.PI * 2;
      const pr = 12 + (Math.random() - 0.5) * 2;
      x = pr * Math.cos(a);
      y = pr * Math.sin(a);
      z = 1.5 + (Math.random() - 0.5) * 1;
    } else if (r < 0.87) {
      // Drum perforation holes: 3 rings × 8 holes
      const ring = Math.floor(Math.random() * 3);
      const hole = Math.floor(Math.random() * 8);
      const hr   = [5, 9, 14][ring];
      const ha   = (hole / 8) * Math.PI * 2 + ring * 0.22;
      x = hr * Math.cos(ha) + (Math.random() - 0.5) * 1.1;
      y = hr * Math.sin(ha) + (Math.random() - 0.5) * 1.1;
      z = 1.5;
    } else {
      // Back face disk
      const a  = Math.random() * Math.PI * 2;
      const br = Math.random() * (R - 3);
      x = br * Math.cos(a);
      y = br * Math.sin(a);
      z = -D;
    }
    out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
  }
  return out;
}

/** Electric resistance coil — flat Archimedean spiral in XY plane */
function coilPoints(): Float32Array {
  const out = new Float32Array(N * 3);
  const turns = 5.5, rMin = 4, rMax = 22, tubeR = 1.6;
  for (let i = 0; i < N; i++) {
    const t  = Math.random();
    const sa = t * turns * Math.PI * 2;
    const sr = rMin + t * (rMax - rMin);
    const ta = Math.random() * Math.PI * 2;
    const tr = Math.random() * tubeR;
    // Tube cross-section lying in XY plane, very thin in Z
    out[i * 3]     = (sr + tr * Math.cos(ta)) * Math.cos(sa);
    out[i * 3 + 1] = (sr + tr * Math.cos(ta)) * Math.sin(sa);
    out[i * 3 + 2] = tr * Math.sin(ta) * 0.45;
  }
  return out;
}

/** Steam iron — side profile in XY plane: wedge soleplate + handle arch */
function ironPoints(): Float32Array {
  const out = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = Math.random();
    let x = 0, y = 0, z = 0;

    if (r < 0.28) {
      // Soleplate bottom edge — flat back, tapers to nose tip
      const t = Math.random();
      x = t * 30 - 15;          // −15 → +15
      y = x > 9 ? -11 + (x - 9) : -11; // nose rises from +9 to +15
      z = (Math.random() - 0.5) * 12;
    } else if (r < 0.41) {
      // Soleplate top surface (flat upper face of the iron body)
      x = Math.random() * 28 - 15;
      y = -6 + (Math.random() - 0.5) * 0.5;
      z = (Math.random() - 0.5) * 12;
    } else if (r < 0.49) {
      // Back wall (left side)
      x = -15 + (Math.random() - 0.5) * 0.5;
      y = -11 + Math.random() * 5;
      z = (Math.random() - 0.5) * 12;
    } else if (r < 0.57) {
      // Soleplate Z-walls (sides)
      const side = Math.random() < 0.5 ? 6 : -6;
      x = Math.random() * 28 - 15;
      y = -11 + Math.random() * 5;
      z = side;
    } else if (r < 0.78) {
      // Handle arch — parabola, base y=−6, peak y=+12 at x=0
      const t  = Math.random();
      x = t * 22 - 11;          // −11 → +11
      const hy = 18 * (1 - (x / 11) ** 2);
      y = -6 + Math.max(0, hy) + (Math.random() - 0.5) * 1.2;
      z = (Math.random() - 0.5) * 10;
    } else if (r < 0.90) {
      // Handle side walls (Z walls of arch)
      const side = Math.random() < 0.5 ? 5 : -5;
      const t  = Math.random();
      x = t * 22 - 11;
      const hy = 18 * (1 - (x / 11) ** 2);
      y = -6 + Math.random() * Math.max(0, hy);
      z = side;
    } else {
      // Steam holes grid on soleplate
      const col = Math.floor(Math.random() * 4);
      const row = Math.floor(Math.random() * 2);
      x = col * 5 - 8 + (Math.random() - 0.5) * 0.7;
      y = -11 + (Math.random() - 0.5) * 0.4;
      z = row * 5 - 2.5 + (Math.random() - 0.5) * 0.7;
    }
    out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
  }
  return out;
}

/** Fan / propeller — 4 swept blades in XY plane + central hub torus */
function fanPoints(): Float32Array {
  const out = new Float32Array(N * 3);
  const BLADES = 4;
  for (let i = 0; i < N; i++) {
    const r = Math.random();
    let x = 0, y = 0, z = 0;

    if (r < 0.10) {
      // Hub torus
      const ha = Math.random() * Math.PI * 2;
      const hb = Math.random() * Math.PI * 2;
      const hR = 4.5, tR = 1.8;
      x = (hR + tR * Math.cos(hb)) * Math.cos(ha);
      y = (hR + tR * Math.cos(hb)) * Math.sin(ha);
      z = tR * Math.sin(hb) * 0.5;
    } else {
      // Swept blades
      const blade = Math.floor(Math.random() * BLADES);
      const base  = (blade / BLADES) * Math.PI * 2;
      const t     = Math.random();           // 0 = hub, 1 = tip
      const w     = (Math.random() - 0.5);  // blade width offset
      const bladeR = 6 + t * 16;
      const bladeW = (1 - t * 0.55) * 7;
      const sweep  = t * 0.48;
      const ba = base + sweep;
      const pa = base + Math.PI / 2 + sweep;
      x = bladeR * Math.cos(ba) + w * bladeW * Math.cos(pa);
      y = bladeR * Math.sin(ba) + w * bladeW * Math.sin(pa);
      z = t * w * 4.5 + (Math.random() - 0.5) * 0.8;
    }
    out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
  }
  return out;
}

const GENERATORS = [drumPoints, coilPoints, ironPoints, fanPoints];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ApplianceMorph() {
  const mountRef  = useRef<HTMLDivElement>(null);
  const [shapeIdx, setShapeIdx] = useState(0);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let disposed = false;
    let raf      = 0;

    // Dynamic import keeps Three.js out of SSR bundle
    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      /* ── Renderer ── */
      const W = el.clientWidth  || 600;
      const H = el.clientHeight || 700;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      /* ── Scene & Camera ── */
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
      camera.position.set(0, 0, 85);

      /* ── Geometry ── */
      const initPos = drumPoints();
      const posBuf  = new THREE.BufferAttribute(initPos.slice(), 3);

      // Vertex colours: ~82% navy, ~18% orange
      const colArr = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        if (Math.random() < 0.18) {
          // orange  #E8652A  = 232, 101,  42
          colArr[i * 3] = 0.910; colArr[i * 3 + 1] = 0.396; colArr[i * 3 + 2] = 0.165;
        } else {
          // navy    #1B2B4B  =  27,  43,  75
          colArr[i * 3] = 0.106; colArr[i * 3 + 1] = 0.169; colArr[i * 3 + 2] = 0.294;
        }
      }
      const colBuf = new THREE.BufferAttribute(colArr, 3);

      /* ── Two layers: crisp core + soft halo (glow on light bg) ── */
      const coreGeo = new THREE.BufferGeometry();
      coreGeo.setAttribute("position", posBuf);
      coreGeo.setAttribute("color",    colBuf);
      const coreMat = new THREE.PointsMaterial({
        size: 0.70, vertexColors: true, transparent: true, opacity: 0.92,
        sizeAttenuation: true,
      });

      const haloGeo = new THREE.BufferGeometry();
      haloGeo.setAttribute("position", posBuf);  // shared buffer
      haloGeo.setAttribute("color",    colBuf);
      const haloMat = new THREE.PointsMaterial({
        size: 4.2, vertexColors: true, transparent: true, opacity: 0.09,
        sizeAttenuation: true,
      });

      const corePoints = new THREE.Points(coreGeo, coreMat);
      const haloPoints = new THREE.Points(haloGeo, haloMat);
      scene.add(haloPoints);
      scene.add(corePoints);

      /* ── Morph state ── */
      let currentShape = 0;
      let fromPos      = new Float32Array(initPos);
      let toPos        = fromPos;
      let morphT       = 0;
      let isMorphing   = false;
      let frame        = 0;

      const startMorph = (next: number) => {
        fromPos    = new Float32Array(posBuf.array as Float32Array);
        toPos      = GENERATORS[next]() as Float32Array<ArrayBuffer>;
        morphT     = 0;
        isMorphing = true;
        currentShape = next;
        setShapeIdx(next);
      };

      /* ── Animation loop ── */
      const animate = () => {
        if (disposed) return;
        raf = requestAnimationFrame(animate);
        frame++;

        // Gentle oscillating rotation (stays mostly face-on)
        corePoints.rotation.y = Math.sin(frame * 0.0028) * 0.28;
        corePoints.rotation.x = Math.sin(frame * 0.0019) * 0.09;
        haloPoints.rotation.y = corePoints.rotation.y;
        haloPoints.rotation.x = corePoints.rotation.x;

        // Auto-trigger morph
        if (!isMorphing && frame > 0 && frame % HOLD_FRAMES === 0) {
          startMorph((currentShape + 1) % GENERATORS.length);
        }

        // Interpolate
        if (isMorphing) {
          morphT += 1 / MORPH_FRAMES;
          const pos = posBuf.array as Float32Array;
          if (morphT >= 1) {
            morphT     = 1;
            isMorphing = false;
            pos.set(toPos);
          } else {
            // Cubic ease-in-out
            const e = morphT < 0.5
              ? 4 * morphT ** 3
              : 1 - (-2 * morphT + 2) ** 3 / 2;
            for (let i = 0; i < pos.length; i++) {
              pos[i] = fromPos[i] + (toPos[i] - fromPos[i]) * e;
            }
          }
          posBuf.needsUpdate = true;
        }

        renderer.render(scene, camera);
      };

      animate();

      /* ── Resize ── */
      const onResize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      /* ── Store cleanup ── */
      (el as HTMLDivElement & { __threeDispose?: () => void }).__threeDispose = () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        coreGeo.dispose(); haloGeo.dispose();
        coreMat.dispose(); haloMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      const el2 = mountRef.current as (HTMLDivElement & { __threeDispose?: () => void }) | null;
      el2?.__threeDispose?.();
      disposed = true; // belt-and-suspenders if async hasn't resolved yet
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Three.js canvas mount */}
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

      {/* Shape label — bottom-center */}
      <div
        style={{
          position:      "absolute",
          bottom:        48,
          left:          "50%",
          transform:     "translateX(-50%)",
          textAlign:     "center",
          pointerEvents: "none",
          minWidth:      200,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={shapeIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
          >
            <p
              style={{
                fontSize:      11,
                fontWeight:    700,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color:         "#E8652A",
                fontFamily:    "var(--font-mono), monospace",
                margin:        "0 0 5px",
              }}
            >
              {SHAPES[shapeIdx].label}
            </p>
            <p
              style={{
                fontSize:      10,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color:         "rgba(27,43,75,0.35)",
                fontFamily:    "var(--font-mono), monospace",
                margin:        0,
              }}
            >
              {SHAPES[shapeIdx].sub}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
