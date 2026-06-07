"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import Image from "next/image";
import GridNeon from "@/components/grid-neon";

const EASE = [0.22, 1, 0.36, 1] as const;
const LINE = "1px solid rgba(10,31,68,0.07)";

const BRANDS = ["LG", "Siemens", "Miele", "Electrolux", "AEG", "Beko", "Indesit", "Whirlpool", "Bosch", "Samsung"];
const TICKER = [...BRANDS, ...BRANDS];

const CTA_CARDS = [
  { illustration: "/illustrations/frigo-panne.png",        title: "J'ai une panne",          sub: "Décrivez le problème"    },
  { illustration: "/illustrations/piece-reference.png",    title: "J'ai une référence",      sub: "Entrez votre code pièce" },
  { illustration: "/illustrations/appareil-reference.png", title: "Je cherche par appareil", sub: "Parcourez le catalogue"  },
];

function WashingMachineIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.1">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5"/>
      <circle cx="7" cy="8.5" r="2.8"/>
      <rect x="2.5" y="2.5" width="3.5" height="1.8" rx="0.5" fill={color} stroke="none"/>
    </svg>
  );
}
function OvenIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.1">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5"/>
      <rect x="3" y="5.5" width="8" height="5.5" rx="0.8"/>
      <circle cx="4.5" cy="3.5" r="0.7" fill={color} stroke="none"/>
      <circle cx="7" cy="3.5" r="0.7" fill={color} stroke="none"/>
      <circle cx="9.5" cy="3.5" r="0.7" fill={color} stroke="none"/>
    </svg>
  );
}
function FridgeIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.1">
      <rect x="2.5" y="1" width="9" height="12" rx="1.5"/>
      <line x1="2.5" y1="5.5" x2="11.5" y2="5.5"/>
      <line x1="6" y1="3" x2="6" y2="4.5"/>
      <line x1="6" y1="7.5" x2="6" y2="9.5"/>
    </svg>
  );
}

export default function HeroSection() {
  const [query,   setQuery]   = useState("");
  const [focused, setFocused] = useState(false);

  const SERIF = "var(--font-playfair), Georgia, serif";
  const MONO  = "var(--font-mono), monospace";
  const SANS  = "var(--font-sans), system-ui, sans-serif";

  return (
    <>
      <section style={{
        position: "relative", width: "100%",
        background: "#F8F9FA", overflow: "hidden",
      }}>

        {/* ── Static 64px grid ────────────────────────────────────────── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: [
            "linear-gradient(rgba(10,31,68,0.045) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(10,31,68,0.045) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "64px 64px",
        }} />

        {/* ── Neon orange travelers ────────────────────────────────────── */}
        <GridNeon />

        {/* ── HERO CONTENT ────────────────────────────────────────────── */}
        <div style={{
          position: "relative", zIndex: 2,
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          padding: "96px 24px 0",
        }}>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              fontSize: 9.5, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "rgba(10,31,68,0.38)",
              fontFamily: MONO, marginBottom: 14,
            }}
          >
            Entreprise familiale belge · Fondée en 1983
          </motion.p>

          {/* Title */}
          <div style={{ marginBottom: 10 }}>
            <motion.span
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
              style={{
                display: "block", color: "#0A1F44",
                fontSize: "clamp(2rem, 3.5vw, 3.8rem)",
                fontWeight: 400, lineHeight: 1.1,
                letterSpacing: "0.04em",
                fontFamily: SERIF, fontStyle: "italic",
              }}
            >La Pièce</motion.span>

            <motion.span
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
              style={{
                display: "block", color: "#0A1F44",
                fontSize: "clamp(3.6rem, 7.5vw, 8.5rem)",
                fontWeight: 900, lineHeight: 0.88,
                letterSpacing: "-0.04em",
                fontFamily: SERIF,
              }}
            >DÉTACHÉE</motion.span>

            <motion.span
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
              style={{
                display: "block", color: "#0A1F44",
                fontSize: "clamp(1rem, 1.8vw, 2rem)",
                fontWeight: 400, lineHeight: 1.3,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily: SERIF, marginTop: 4,
                opacity: 0.70,
              }}
            >Électroménager</motion.span>
          </div>

          {/* Reference text */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            style={{
              fontSize: 12, color: "rgba(10,31,68,0.34)",
              fontFamily: SANS, marginBottom: 16, letterSpacing: "0.01em",
            }}
          >
            100 000 références · Livraison 48h · 6 pays d'Europe
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44, ease: EASE }}
            style={{ width: "100%", maxWidth: 660, marginBottom: 14 }}
          >
            <form onSubmit={e => e.preventDefault()}>
              <div style={{
                display: "flex", alignItems: "center", height: 60,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                borderRadius: 14,
                border: `1.5px solid ${focused ? "#E66324" : "rgba(10,31,68,0.10)"}`,
                boxShadow: focused
                  ? "0 0 0 3px rgba(230,99,36,0.09), 0 8px 28px rgba(0,0,0,0.07)"
                  : "0 6px 24px rgba(0,0,0,0.06)",
                overflow: "hidden",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 18px" }}>
                  <Search size={16} style={{ color: focused ? "#E66324" : "#bbb", flexShrink: 0, transition: "color 0.2s" }} />
                  <input
                    type="text" value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Ex: Pompe de vidange Bosch, filtre de hotte Whirlpool..."
                    style={{
                      flex: 1, border: "none", outline: "none",
                      background: "transparent", fontSize: 14,
                      color: "#0A1F44", fontFamily: "inherit",
                    }}
                  />
                </div>
                <div style={{ padding: "0 5px 0 0" }}>
                  <button type="submit" style={{
                    height: 48, padding: "0 24px",
                    background: "#E66324", color: "white",
                    border: "none", borderRadius: 10,
                    fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#c94f1a"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#E66324"; }}
                  >
                    Rechercher
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.52, ease: EASE }}
            style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}
          >
            {[
              { icon: <WashingMachineIcon color="rgba(10,31,68,0.42)" />, pulse: true,  text: "100 000 en stock" },
              { icon: <OvenIcon           color="rgba(10,31,68,0.42)" />, pulse: false, text: "Livraison 48h"    },
              { icon: <FridgeIcon         color="rgba(10,31,68,0.42)" />, pulse: false, text: "Garantie 12 mois" },
            ].map(({ icon, pulse, text }, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 10px",
                background: "rgba(255,255,255,0.62)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                borderRadius: 99,
                border: "1px solid rgba(255,255,255,0.82)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                {icon}
                {pulse && (
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#22c55e", flexShrink: 0,
                    animation: "live-pulse 2s ease-in-out infinite",
                  }} />
                )}
                <span style={{
                  fontSize: 9.5, fontWeight: 600, letterSpacing: "1.4px",
                  textTransform: "uppercase", color: "rgba(10,31,68,0.40)",
                  fontFamily: MONO,
                }}>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── CTA CARDS ───────────────────────────────────────────────── */}
        <div style={{
          position: "relative", zIndex: 2,
          display: "flex", gap: 16, justifyContent: "center",
          padding: "0 24px 32px", flexWrap: "wrap",
        }}>
          {CTA_CARDS.map(({ illustration, title, sub }, i) => (
            <motion.button
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62 + i * 0.10, ease: EASE }}
              style={{
                flex: "1 1 210px", maxWidth: 248,
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                borderRadius: 16,
                border: "1px solid rgba(10,31,68,0.07)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                cursor: "pointer", textAlign: "left",
                fontFamily: "inherit", overflow: "hidden",
                transition: "transform 0.22s ease, box-shadow 0.22s ease, border-left 0.15s ease",
                padding: 0,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform  = "translateY(-4px)";
                el.style.boxShadow  = "0 12px 32px rgba(10,31,68,0.10)";
                el.style.borderLeft = "3px solid #E66324";
                const arrow = el.querySelector<HTMLElement>(".cta-arrow");
                if (arrow) arrow.style.transform = "translateX(4px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform  = "translateY(0)";
                el.style.boxShadow  = "0 4px 18px rgba(0,0,0,0.05)";
                el.style.borderLeft = "1px solid rgba(10,31,68,0.07)";
                const arrow = el.querySelector<HTMLElement>(".cta-arrow");
                if (arrow) arrow.style.transform = "translateX(0)";
              }}
            >
              {/* Illustration area */}
              <div style={{
                height: 96, background: "#F0EEEb",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderBottom: "1px solid rgba(10,31,68,0.05)",
              }}>
                <Image src={illustration} alt={title} width={68} height={68}
                  style={{ objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.10))" }}
                />
              </div>
              {/* Text + arrow */}
              <div style={{ padding: "12px 14px 12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1F44", fontFamily: SANS, marginBottom: 2, letterSpacing: "-0.01em" }}>{title}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(10,31,68,0.40)", fontFamily: SANS }}>{sub}</div>
                </div>
                <ArrowRight size={14} color="#E66324" className="cta-arrow"
                  style={{ flexShrink: 0, transition: "transform 0.2s ease" }} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Brand ticker ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          style={{
            position: "relative", zIndex: 2, width: "100%",
            overflow: "hidden", borderTop: LINE, padding: "10px 0",
            background: "rgba(248,249,250,0.92)",
          }}
        >
          <div style={{ display: "flex", width: "max-content", animation: "abelec-ticker 36s linear infinite" }}>
            {TICKER.map((brand, i) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 500, letterSpacing: "3px",
                textTransform: "uppercase", color: "rgba(10,31,68,0.20)",
                fontFamily: MONO, padding: "0 28px", whiteSpace: "nowrap", userSelect: "none",
              }}>
                {brand}<span style={{ marginLeft: 28, opacity: 0.35 }}>·</span>
              </span>
            ))}
          </div>
        </motion.div>

        <style>{`
          @keyframes abelec-ticker {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @keyframes live-pulse {
            0%, 100% { opacity: 1;    transform: scale(1); }
            50%       { opacity: 0.4; transform: scale(0.72); }
          }
        `}</style>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ borderBottom: LINE, background: "white" }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", padding: "13px 48px",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 36, flexWrap: "wrap",
        }}>
          {[
            { label: "4.9 / 5",           sub: "312 avis vérifiés" },
            { label: "Garantie 12 mois",   sub: undefined },
            { label: "Livraison 48h",      sub: undefined },
            { label: "100 000 références", sub: "en stock" },
          ].map(({ label, sub }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#0A1F44" }}>{label}</span>
              {sub && <span style={{ fontSize: 11.5, color: "#9a9a9a" }}>{sub}</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
