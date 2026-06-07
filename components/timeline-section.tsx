"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useT } from "@/lib/i18n";
import timelineData from "@/data/timeline.json";

const MILESTONES = timelineData.map((m) => ({
  year:    m.year,
  labelKey: m.label,
  titleKey: m.title,
  descKey:  m.description,
}));

export default function TimelineSection() {
  const t            = useT();
  const trackRef     = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target:  trackRef,
    offset:  ["start 80%", "end 30%"],
  });
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="bg-white border-t border-abelec-cream-line py-16 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="eyebrow mb-4">&mdash; {t("timeline.since")} &mdash;</p>
          <h2 className="font-slab text-abelec-navy">
            {t("timeline.title")}{" "}
            <span className="text-abelec-orange italic">{t("timeline.titleAccent")}</span>
          </h2>
          <p className="mt-4 text-[17px] text-abelec-muted max-w-[480px] mx-auto leading-relaxed">
            {t("timeline.sub")}
          </p>
        </div>

        {/* ── Horizontal scroll track ── */}
        <div className="relative" ref={trackRef}>

          {/* Animated horizontal line */}
          <div className="relative h-px bg-abelec-cream-line mb-0 mx-10">
            <motion.div
              className="absolute inset-0 origin-left"
              style={{ scaleX: lineScaleX, background: "rgba(26,58,92,0.25)" }}
            />
          </div>

          {/* Milestone row */}
          <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${MILESTONES.length}, 1fr)` }}>
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center pt-6 px-3"
              >
                {/* Dot */}
                <div
                  className="absolute -top-[5px] w-[10px] h-[10px] rounded-full shrink-0 z-10"
                  style={{
                    background: "#d97e3a",
                    boxShadow: "0 0 0 3px #ffffff, 0 0 0 4.5px rgba(26,58,92,0.12)",
                  }}
                />

                {/* Year */}
                <p
                  className="font-slab font-bold text-abelec-navy leading-none mb-2 text-center"
                  style={{ fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: "-0.04em" }}
                >
                  {m.year}
                </p>

                {/* Badge */}
                <span
                  className="inline-block font-mono text-[9px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full mb-2"
                  style={{
                    background: "#F4EFE6",
                    border: "1px solid rgba(26,58,92,0.15)",
                    color: "rgba(26,58,92,0.65)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t(m.labelKey)}
                </span>

                {/* Title */}
                <h3 className="font-slab text-abelec-navy font-bold text-center mb-1"
                  style={{ fontSize: "clamp(12px,1.1vw,15px)", lineHeight: 1.3 }}>
                  {t(m.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-abelec-muted text-center leading-relaxed"
                  style={{ fontSize: "clamp(10px,0.9vw,12.5px)" }}>
                  {t(m.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
