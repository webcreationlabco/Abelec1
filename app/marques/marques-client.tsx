"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";

// ── Brand data ───────────────────────────────────────────────────────────────
type Categorie = "gros" | "petit" | "aspiration";

interface Brand {
  name: string;
  slug: string;
  categorie: Categorie;
}

const BRANDS: Brand[] = [
  { name: "Whirlpool",   slug: "whirlpool",   categorie: "gros" },
  { name: "Bosch",       slug: "bosch",       categorie: "gros" },
  { name: "Samsung",     slug: "samsung",     categorie: "gros" },
  { name: "LG",          slug: "lg",          categorie: "gros" },
  { name: "Siemens",     slug: "siemens",     categorie: "gros" },
  { name: "Miele",       slug: "miele",       categorie: "gros" },
  { name: "Electrolux",  slug: "electrolux",  categorie: "gros" },
  { name: "AEG",         slug: "aeg",         categorie: "gros" },
  { name: "Indesit",     slug: "indesit",     categorie: "gros" },
  { name: "Hotpoint",    slug: "hotpoint",    categorie: "gros" },
  { name: "Beko",        slug: "beko",        categorie: "gros" },
  { name: "Arçelik",     slug: "arcelik",     categorie: "gros" },
  { name: "Bauknecht",   slug: "bauknecht",   categorie: "gros" },
  { name: "De Dietrich", slug: "de-dietrich", categorie: "gros" },
  { name: "Brandt",      slug: "brandt",      categorie: "gros" },
  { name: "Neff",        slug: "neff",        categorie: "gros" },
  { name: "Liebherr",    slug: "liebherr",    categorie: "gros" },
  { name: "Candy",       slug: "candy",       categorie: "gros" },
  { name: "Hoover",      slug: "hoover",      categorie: "gros" },
  { name: "Fagor",       slug: "fagor",       categorie: "gros" },
  { name: "Smeg",        slug: "smeg",        categorie: "gros" },
  { name: "Zanussi",     slug: "zanussi",     categorie: "gros" },
  { name: "Gorenje",     slug: "gorenje",     categorie: "gros" },
  { name: "Haier",       slug: "haier",       categorie: "gros" },
  { name: "Hisense",     slug: "hisense",     categorie: "gros" },
  { name: "Grundig",     slug: "grundig",     categorie: "gros" },
  { name: "Dyson",       slug: "dyson",       categorie: "aspiration" },
  { name: "Rowenta",     slug: "rowenta",     categorie: "aspiration" },
  { name: "Philips",     slug: "philips",     categorie: "petit" },
  { name: "Tefal",       slug: "tefal",       categorie: "petit" },
];

// ── Animation helpers ────────────────────────────────────────────────────────
const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.035 } },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 18, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

// ── Brand card ───────────────────────────────────────────────────────────────
function BrandCard({ brand }: { brand: Brand }) {
  const t = useT();
  const catLabels: Record<Categorie, string> = {
    gros:       t("marques.catGros"),
    petit:      t("marques.catPetit"),
    aspiration: t("marques.catAspiration"),
  };

  return (
    <motion.div variants={cardVariant}>
      <Link
        href={`/catalogue?marque=${brand.slug}`}
        className="group flex flex-col items-center justify-center gap-2.5 px-4 py-6 rounded-xl bg-white border border-[#E8E0D5] transition-all duration-200 hover:-translate-y-1 hover:border-abelec-orange hover:shadow-[0_8px_28px_rgba(217,126,58,0.14)]"
      >
        {/* Initials badge — placeholder for logo */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center font-slab font-bold text-[13px] text-abelec-navy bg-abelec-cream-light border border-abelec-cream-line group-hover:border-abelec-orange/30 transition-colors"
        >
          {brand.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="text-center">
          <p className="font-slab font-bold text-[15px] text-abelec-navy group-hover:text-abelec-orange transition-colors leading-tight">
            {brand.name}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-abelec-muted mt-1">
            {catLabels[brand.categorie]}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MarquesClient() {
  const t = useT();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BRANDS;
    return BRANDS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.categorie.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="w-full border-b border-abelec-cream-line py-16 sm:py-20 px-6 text-center"
        style={{ background: "linear-gradient(180deg,#F8F5F0 0%,#F4EFE6 100%)" }}
      >
        <div className="max-w-[640px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-abelec-orange mb-4"
          >
            {t("marques.heroBreadcrumb")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.07 }}
            className="font-slab text-abelec-navy-ink leading-[1.05]"
            style={{ fontSize: "clamp(32px, 5vw, 58px)", letterSpacing: "-0.025em" }}
          >
            {t("marques.heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-4 text-[16.5px] text-abelec-muted leading-relaxed"
          >
            {t("marques.heroSub")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-abelec-cream-line bg-white/70"
          >
            <span className="font-mono text-[11px] text-abelec-navy-ink font-semibold">{t("marques.badge1")}</span>
            <span className="w-1 h-1 rounded-full bg-abelec-orange" />
            <span className="font-mono text-[11px] text-abelec-muted">{t("marques.badge2")}</span>
          </motion.div>
        </div>
      </section>

      {/* ── Search bar ───────────────────────────────────────────────────── */}
      <section className="py-8 px-6" style={{ background: "#F4EFE6" }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-[480px] mx-auto"
        >
          <div className="relative">
            <Search
              size={17}
              strokeWidth={2}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-abelec-navy pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("marques.searchPlaceholder")}
              className="w-full h-[52px] pl-11 pr-5 rounded-2xl bg-white border border-[#E8E0D5] text-[15px] text-abelec-navy-ink placeholder:text-abelec-muted-2 outline-none focus:border-abelec-orange transition-colors"
              style={{ boxShadow: "0 2px 12px rgba(26,58,92,0.07)" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── Brand grid ───────────────────────────────────────────────────── */}
      <section className="px-6 pb-20 pt-4" style={{ background: "#F4EFE6" }}>
        <div className="max-w-[1240px] mx-auto">
          {filtered.length > 0 ? (
            <motion.div
              key={query}
              className="grid grid-cols-6 gap-3 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2"
              initial="hidden"
              animate="visible"
              variants={container}
            >
              {filtered.map((brand) => (
                <BrandCard key={brand.slug} brand={brand} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-slab text-abelec-navy text-[20px] mb-2">{t("marques.notFound")}</p>
              <p className="text-abelec-muted text-[14px]">
                {t("marques.notFoundSub")}
              </p>
            </motion.div>
          )}

          {/* Below-grid CTA */}
          <div className="mt-14 flex flex-col items-center gap-5 text-center">
            <p className="text-[15px] text-abelec-muted">
              {t("marques.ctaSub")}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 bg-abelec-orange hover:bg-[#b8612a] text-white px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-colors"
              style={{ boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.12), 0 6px 20px rgba(217,126,58,0.28)" }}
            >
              {t("marques.ctaBtn")}
              <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
