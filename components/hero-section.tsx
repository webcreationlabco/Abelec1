"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import Image from "next/image";

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

function BentoLabel({ text }: { text: string }) {
  const MONO = "var(--font-mono), monospace";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 8.5, fontFamily: MONO, letterSpacing: "0.18em",
      textTransform: "uppercase", color: "rgba(10,31,68,0.28)",
      marginBottom: 20,
    }}>
      <span style={{ opacity: 0.5 }}>[</span>
      <span>{text}</span>
      <span style={{ opacity: 0.5 }}>]</span>
    </div>
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
        position:   "relative",
        width:      "100%",
        minHeight:  "100vh",
        background: "#F8F9FA",
        display:    "flex",
        flexDirection: "column",
        overflow:   "hidden",
      }}>

        {/* ── Subtle horizontal scan-line texture ───────────────────────── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(10,31,68,0.025) 31px, rgba(10,31,68,0.025) 32px)",
        }} />

        {/* ── BENTO GRID ────────────────────────────────────────────────── */}
        <div style={{
          flex: 1, position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: "clamp(170px,15vw,230px) 1fr clamp(170px,15vw,230px)",
          gridTemplateRows: "1fr auto",
          minHeight: "calc(100vh - 42px)",
        }}>

          {/* ── LEFT BENTO — Stock Live ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            style={{
              borderRight: LINE, gridRow: "1 / 2",
              padding: "clamp(28px,4vh,52px) clamp(18px,2vw,30px)",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}
          >
            <BentoLabel text="STOCK_LIVE" />

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#22c55e", flexShrink: 0,
                animation: "live-pulse 2s ease-in-out infinite",
              }} />
              <span style={{
                fontSize: 8.5, fontFamily: MONO, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#22c55e",
              }}>EN DIRECT</span>
            </div>

            <div style={{
              fontSize: "clamp(26px,2.6vw,38px)", fontWeight: 800,
              color: "#0A1F44", letterSpacing: "-0.03em", lineHeight: 1,
              fontFamily: SANS, fontVariantNumeric: "tabular-nums",
              marginBottom: 8,
            }}>
              142,839
            </div>

            <div style={{
              fontSize: 9, fontFamily: MONO, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(10,31,68,0.33)",
              lineHeight: 1.6,
            }}>
              PIÈCES DÉTACHÉES<br />DISPONIBLES
            </div>

            <div style={{ borderTop: LINE, margin: "20px 0" }} />

            <div style={{
              fontSize: 8.5, fontFamily: MONO, color: "rgba(10,31,68,0.20)",
              letterSpacing: "0.10em", textTransform: "uppercase",
            }}>
              MIS À JOUR · EN CONTINU
            </div>
          </motion.div>

          {/* ── CENTER — Hero content ────────────────────────────────────── */}
          <div style={{
            gridRow: "1 / 2",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "88px clamp(24px,4vw,56px) 40px",
            textAlign: "center",
            borderBottom: LINE,
          }}>

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                fontSize: 9.5, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "rgba(10,31,68,0.38)",
                fontFamily: MONO, marginBottom: 18,
              }}
            >
              Entreprise familiale belge · Fondée en 1983
            </motion.p>

            {/* Title bloc */}
            <div style={{ marginBottom: 14 }}>
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.10, ease: EASE }}
                style={{
                  display: "block", color: "#0A1F44",
                  fontSize: "clamp(2.2rem,3.8vw,4.2rem)",
                  fontWeight: 400, lineHeight: 1.1,
                  letterSpacing: "0.04em",
                  fontFamily: SERIF, fontStyle: "italic",
                }}
              >
                La Pièce
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.22, ease: EASE }}
                style={{
                  display: "block", color: "#0A1F44",
                  fontSize: "clamp(4rem,8vw,9rem)",
                  fontWeight: 900, lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  fontFamily: SERIF,
                }}
              >
                DÉTACHÉE
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.34, ease: EASE }}
                style={{
                  display: "block", color: "#0A1F44",
                  fontSize: "clamp(1.1rem,2vw,2.2rem)",
                  fontWeight: 400, lineHeight: 1.3,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: SERIF, marginTop: 6,
                  opacity: 0.72,
                }}
              >
                Électroménager
              </motion.span>
            </div>

            {/* Reference text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.46 }}
              style={{
                fontSize: 12.5, color: "rgba(10,31,68,0.36)",
                fontFamily: SANS, marginBottom: 18,
                letterSpacing: "0.01em",
              }}
            >
              100 000 références · Livraison 48h · 6 pays d'Europe
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.50, ease: EASE }}
              style={{ width: "100%", maxWidth: 560, marginBottom: 14 }}
            >
              <form onSubmit={e => e.preventDefault()}>
                <div style={{
                  display: "flex", alignItems: "center", height: 52,
                  background: "rgba(255,255,255,0.90)",
                  backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                  borderRadius: 11,
                  border: `1.5px solid ${focused ? "#E66324" : "rgba(10,31,68,0.10)"}`,
                  boxShadow: focused
                    ? "0 0 0 3px rgba(230,99,36,0.09), 0 6px 20px rgba(0,0,0,0.06)"
                    : "0 4px 16px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 14px" }}>
                    <Search size={13} style={{ color: focused ? "#E66324" : "#bbb", flexShrink: 0, transition: "color 0.2s" }} />
                    <input
                      type="text" value={query}
                      onChange={e => setQuery(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="Ex: Pompe de vidange Bosch, filtre de hotte Whirlpool..."
                      style={{
                        flex: 1, border: "none", outline: "none",
                        background: "transparent", fontSize: 12.5,
                        color: "#0A1F44", fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <div style={{ padding: "0 4px 0 0" }}>
                    <button type="submit" style={{
                      height: 40, padding: "0 18px",
                      background: "#E66324", color: "white",
                      border: "none", borderRadius: 8,
                      fontSize: 12.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.60, ease: EASE }}
              style={{ display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap" }}
            >
              {[
                { icon: <WashingMachineIcon color="rgba(10,31,68,0.42)" />, pulse: true,  text: "100 000 références en stock" },
                { icon: <OvenIcon           color="rgba(10,31,68,0.42)" />, pulse: false, text: "Livraison 48h" },
                { icon: <FridgeIcon         color="rgba(10,31,68,0.42)" />, pulse: false, text: "Garantie 12 mois" },
              ].map(({ icon, pulse, text }, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "5px 11px",
                  background: "rgba(255,255,255,0.62)",
                  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  borderRadius: 99,
                  border: "1px solid rgba(255,255,255,0.82)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}>
                  {icon}
                  {pulse && (
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
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

          {/* ── RIGHT BENTO — Support Technique ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            style={{
              borderLeft: LINE, gridRow: "1 / 2",
              padding: "clamp(28px,4vh,52px) clamp(18px,2vw,30px)",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}
          >
            <BentoLabel text="SUPPORT TECHNIQUE" />

            <div style={{
              fontSize: "clamp(22px,2.2vw,32px)", fontWeight: 800,
              color: "#0A1F44", letterSpacing: "-0.02em", lineHeight: 1.1,
              fontFamily: SANS, marginBottom: 4,
            }}>
              9:00 – 18:00
            </div>

            <div style={{
              fontSize: 9, fontFamily: MONO, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(10,31,68,0.33)",
              marginBottom: 20,
            }}>
              (LUN – VEN)
            </div>

            <div style={{ borderTop: LINE, margin: "0 0 20px" }} />

            <div style={{
              display: "flex", alignItems: "center", gap: 6, marginBottom: 14,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#22c55e", flexShrink: 0,
                animation: "live-pulse 2s ease-in-out infinite",
              }} />
              <span style={{
                fontSize: 8.5, fontFamily: MONO, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#22c55e",
              }}>DISPONIBLE</span>
            </div>

            <div style={{
              fontSize: 9, fontFamily: MONO, color: "rgba(10,31,68,0.20)",
              letterSpacing: "0.10em", textTransform: "uppercase", lineHeight: 1.6,
            }}>
              CONSEIL TECHNIQUE<br />PRISE EN CHARGE RAPIDE
            </div>
          </motion.div>

          {/* ── CTA CARDS ROW ────────────────────────────────────────────── */}
          <div style={{
            gridColumn: "1 / -1", gridRow: "2 / 3",
            display: "grid", gridTemplateColumns: "repeat(3,1fr)",
            borderTop: LINE,
          }}>
            {CTA_CARDS.map(({ illustration, title, sub }, i) => (
              <motion.button
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.70 + i * 0.09, ease: EASE }}
                style={{
                  background: "transparent",
                  borderRight: i < 2 ? LINE : "none",
                  borderLeft: "none", borderTop: "none", borderBottom: "none",
                  cursor: "pointer", textAlign: "left",
                  fontFamily: "inherit", overflow: "hidden",
                  padding: "22px 28px",
                  display: "flex", alignItems: "center", gap: 16,
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.70)";
                  const arrow = el.querySelector<HTMLElement>(".cta-arrow");
                  if (arrow) arrow.style.transform = "translateX(4px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "transparent";
                  const arrow = el.querySelector<HTMLElement>(".cta-arrow");
                  if (arrow) arrow.style.transform = "translateX(0)";
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "rgba(10,31,68,0.04)",
                  border: LINE,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Image src={illustration} alt={title} width={28} height={28}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: "#0A1F44",
                    fontFamily: SANS, marginBottom: 2, letterSpacing: "-0.01em",
                  }}>{title}</div>
                  <div style={{
                    fontSize: 11.5, color: "rgba(10,31,68,0.38)",
                    fontFamily: SANS,
                  }}>{sub}</div>
                </div>
                <ArrowRight size={14} color="#E66324" className="cta-arrow"
                  style={{ flexShrink: 0, transition: "transform 0.2s ease" }} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Brand ticker ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.0 }}
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
