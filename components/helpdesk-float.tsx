"use client";

import { useState } from "react";
import { MessageCircle, X, Mail, Phone, ChevronRight, Package, Truck, RotateCcw, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/lib/i18n";

const TOPIC_ICONS = [Package, Truck, RotateCcw, HelpCircle] as const;

export default function HelpdeskFloat() {
  const t = useT();
  const [open, setOpen] = useState(false);

  const topics = ([1, 2, 3, 4] as const).map((n, i) => ({
    icon: TOPIC_ICONS[i],
    label: t(`helpdeskPanel.topic${n}Label`),
    sub:   t(`helpdeskPanel.topic${n}Sub`),
  }));

  return (
    <>
      {/* ── FAB ── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 220, damping: 18 }}
        whileHover={{ y: -2 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[200] bg-abelec-orange text-white flex items-center gap-2 px-4 sm:px-[22px] py-3 sm:py-3.5 rounded-full font-semibold text-[13px] sm:text-[14px] cursor-pointer overflow-hidden"
        style={{ boxShadow: "0 8px 32px rgba(217,126,58,.4), inset 0 -3px 0 rgba(0,0,0,.15)" }}
        aria-label={t("helpdesk")}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={20} strokeWidth={2.2} />
            </motion.span>
          ) : (
            <motion.span key="chat"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle size={20} strokeWidth={2.2} />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="hidden sm:inline">{t("helpdesk")}</span>
        {!open && <span className="w-[9px] h-[9px] rounded-full bg-green-400 animate-pulse shrink-0" />}
      </motion.button>

      {/* ── Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{   opacity: 0, y: 24, scale: 0.97  }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed z-[199]"
            style={{
              right: "clamp(8px, 4vw, 24px)",
              bottom: "clamp(68px, 12vw, 96px)",
              width: "min(340px, calc(100vw - 16px))",
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 24px 80px rgba(15,35,64,0.18), 0 4px 16px rgba(15,35,64,0.08)",
              border: "1px solid rgba(26,58,92,0.08)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-4 bg-abelec-navy">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-abelec-orange flex items-center justify-center shrink-0">
                  <MessageCircle size={18} strokeWidth={2} className="text-white" />
                </div>
                <div>
                  <p className="font-slab font-bold text-white text-[15px] leading-tight">Support Abelec</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                    <span className="text-[11px] text-white/60 font-mono">{t("helpdeskPanel.status")}</span>
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-white/70 leading-relaxed">
                {t("helpdeskPanel.greeting")}
              </p>
            </div>

            {/* Quick topics */}
            <div className="px-3 sm:px-4 py-3 border-b border-abelec-cream-line">
              <p className="font-mono text-[9.5px] text-abelec-muted-2 uppercase tracking-[0.1em] mb-2.5">
                {t("helpdeskPanel.chooseSubject")}
              </p>
              <div className="flex flex-col gap-1.5">
                {topics.map(({ icon: Icon, label, sub }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-abelec-cream-light hover:bg-abelec-orange/[0.06] hover:border-abelec-orange border border-transparent transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-abelec-cream-line flex items-center justify-center shrink-0 group-hover:border-abelec-orange transition-colors">
                      <Icon size={15} strokeWidth={1.8} className="text-abelec-navy group-hover:text-abelec-orange transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-abelec-navy leading-tight truncate">{label}</p>
                      <p className="text-[11px] text-abelec-muted mt-0.5 truncate">{sub}</p>
                    </div>
                    <ChevronRight size={14} className="text-abelec-muted group-hover:text-abelec-orange shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Contact options */}
            <div className="px-3 sm:px-4 py-3">
              <p className="font-mono text-[9.5px] text-abelec-muted-2 uppercase tracking-[0.1em] mb-2.5">
                {t("helpdeskPanel.contactDirect")}
              </p>
              <div className="flex gap-2">
                <a
                  href={`mailto:${t("footer.email")}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-abelec-cream-line bg-abelec-cream-light hover:border-abelec-orange hover:bg-abelec-orange/[0.06] transition-all text-[12.5px] font-medium text-abelec-navy"
                >
                  <Mail size={14} strokeWidth={2} className="text-abelec-orange" />
                  {t("helpdeskPanel.email")}
                </a>
                <a
                  href={`tel:${t("topStrip.phone")}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-abelec-cream-line bg-abelec-cream-light hover:border-abelec-orange hover:bg-abelec-orange/[0.06] transition-all text-[12.5px] font-medium text-abelec-navy"
                >
                  <Phone size={14} strokeWidth={2} className="text-abelec-orange" />
                  {t("helpdeskPanel.call")}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
