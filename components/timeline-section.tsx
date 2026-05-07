"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useT } from "@/lib/i18n";
import timelineData from "@/data/timeline.json";

const MILESTONES = timelineData.map((m) => ({
  year: m.year,
  labelKey: m.label,
  titleKey: m.title,
  descKey: m.description,
}));

// ── Milestone card ─────────────────────────────────────────────────────────
function MilestoneCard({
  milestone,
  t,
}: {
  milestone: (typeof MILESTONES)[0];
  t: (k: string) => string;
}) {
  return (
    <div
      className="bg-white rounded-[12px] p-6"
      style={{ border: "1px solid rgba(26,58,92,0.1)" }}
    >
      {/* Year */}
      <p
        className="font-slab font-bold text-abelec-navy leading-none mb-2.5"
        style={{ fontSize: "clamp(24px, 5vw, 36px)", letterSpacing: "-0.04em" }}
      >
        {milestone.year}
      </p>

      {/* Badge */}
      <span
        className="inline-block font-mono text-[10.5px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full mb-3"
        style={{
          background: "#F4EFE6",
          border: "1px solid rgba(26,58,92,0.18)",
          color: "rgba(26,58,92,0.75)",
        }}
      >
        {t(milestone.labelKey)}
      </span>

      {/* Title */}
      <h3 className="font-slab text-abelec-navy font-bold text-[16px] mb-1.5">
        {t(milestone.titleKey)}
      </h3>

      {/* Description */}
      <p className="text-[13.5px] text-abelec-muted leading-relaxed">
        {t(milestone.descKey)}
      </p>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────
export default function TimelineSection() {
  const t = useT();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 20%"],
  });

  // Line draws from top to bottom as user scrolls through the section
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="bg-white border-t border-abelec-cream-line py-16 px-6 overflow-hidden">
      <div className="max-w-[1240px] mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="eyebrow mb-4">&mdash; {t("timeline.since")} &mdash;</p>
          <h2 className="font-slab text-abelec-navy">
            {t("timeline.title")}{" "}
            <span className="text-abelec-orange italic">{t("timeline.titleAccent")}</span>
          </h2>
          <p className="mt-4 text-[17px] text-abelec-muted max-w-[480px] mx-auto leading-relaxed">
            {t("timeline.sub")}
          </p>
        </div>

        {/* Vertical timeline */}
        <div ref={containerRef} className="relative max-w-[960px] mx-auto">

          {/* Animated vertical line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-px origin-top"
            style={{
              scaleY: lineScaleY,
              height: "100%",
              background: "rgba(26,58,92,0.2)",
            }}
          />

          {/* Milestones */}
          <div className="flex flex-col gap-10 max-md:gap-6">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={m.year}
                  className="relative flex items-center max-md:flex-row max-md:gap-0"
                >
                  {/* ── Left half ── */}
                  <div className="flex-1 flex justify-end items-center min-w-0 max-md:hidden">
                    {isLeft ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -40 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
                          className="max-w-[420px] w-full"
                        >
                          <MilestoneCard milestone={m} t={t} />
                        </motion.div>
                        {/* Connector */}
                        <div
                          className="w-8 h-px shrink-0"
                          style={{ background: "rgba(26,58,92,0.15)" }}
                        />
                      </>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>

                  {/* ── Dot ── */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.08 + 0.12 }}
                    className="w-3 h-3 rounded-full shrink-0 z-10 max-md:shrink-0 max-md:ml-2"
                    style={{
                      background: "#d97e3a",
                      boxShadow: "0 0 0 3px #ffffff, 0 0 0 4.5px rgba(26,58,92,0.12)",
                    }}
                  />

                  {/* ── Right half ── */}
                  <div className="flex-1 flex justify-start items-center min-w-0 max-md:pl-4">
                    {!isLeft ? (
                      <>
                        {/* Connector */}
                        <div
                          className="w-8 h-px shrink-0 max-md:hidden"
                          style={{ background: "rgba(26,58,92,0.15)" }}
                        />
                        <motion.div
                          initial={{ opacity: 0, x: 40 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
                          className="max-w-[420px] w-full"
                        >
                          <MilestoneCard milestone={m} t={t} />
                        </motion.div>
                      </>
                    ) : (
                      <>
                        {/* Mobile: always show card on right */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
                          className="hidden max-md:block w-full"
                        >
                          <MilestoneCard milestone={m} t={t} />
                        </motion.div>
                        <div className="flex-1 max-md:hidden" />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
