"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/lib/i18n";

const Q_COUNT = 6;

type Message = { id: number; from: "bot" | "user"; text: string };

export default function HelpdeskFloat() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const idRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const newId = () => ++idRef.current;

  // Greeting on first open
  useEffect(() => {
    if (!open) return;
    if (messages.length > 0) return;
    setTyping(true);
    const timer = setTimeout(() => {
      setTyping(false);
      setMessages([{ id: newId(), from: "bot", text: t("chatbot.greeting") }]);
      setTimeout(() => setShowQuestions(true), 350);
    }, 750);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Scroll to bottom on every update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, showQuestions]);

  const handleToggle = () => {
    if (open) {
      setOpen(false);
      // Reset state after close animation
      setTimeout(() => {
        setMessages([]);
        setShowQuestions(false);
        setTyping(false);
        idRef.current = 0;
      }, 300);
    } else {
      setOpen(true);
    }
  };

  const handleQuestion = (n: number) => {
    const userMsg: Message = { id: newId(), from: "user", text: t(`chatbot.q${n}`) };
    setMessages((prev) => [...prev, userMsg]);
    setShowQuestions(false);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const botMsg: Message = { id: newId(), from: "bot", text: t(`chatbot.a${n}`) };
      setMessages((prev) => [...prev, botMsg]);
      setTimeout(() => setShowQuestions(true), 400);
    }, 1100);
  };

  return (
    <>
      {/* ── FAB ── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 220, damping: 18 }}
        whileHover={{ y: -2 }}
        onClick={handleToggle}
        className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[200] bg-abelec-orange text-white flex items-center gap-2 px-4 sm:px-[22px] py-3 sm:py-3.5 rounded-full font-semibold text-[13px] sm:text-[14px] cursor-pointer"
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

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 20, scale: 0.96  }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed z-[199] flex flex-col"
            style={{
              right:         "clamp(8px, 4vw, 24px)",
              bottom:        "clamp(68px, 12vw, 96px)",
              width:         "min(340px, calc(100vw - 16px))",
              height:        "min(520px, calc(100dvh - 120px))",
              background:    "#ffffff",
              borderRadius:  "20px",
              boxShadow:     "0 20px 60px rgba(15,35,64,0.18), 0 4px 16px rgba(15,35,64,0.07)",
              border:        "1px solid rgba(26,58,92,0.08)",
              overflow:      "hidden",
            }}
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-3.5 bg-abelec-navy shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-abelec-orange flex items-center justify-center shrink-0">
                  <MessageCircle size={17} strokeWidth={2} className="text-white" />
                </div>
                <div>
                  <p className="font-slab font-bold text-white text-[15px] leading-tight">
                    {t("chatbot.title")}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                    <span className="text-[11px] text-white/60 font-mono">{t("chatbot.status")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5"
              style={{ scrollbarWidth: "none" }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0,  scale: 1    }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[84%] px-3.5 py-2.5 text-[13.5px] leading-snug ${
                        msg.from === "user"
                          ? "bg-abelec-orange text-white rounded-2xl rounded-br-sm"
                          : "bg-abelec-cream-light text-abelec-navy-ink border border-abelec-cream-line rounded-2xl rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-abelec-cream-light border border-abelec-cream-line rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-abelec-muted inline-block"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.14 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Predefined question chips */}
              <AnimatePresence>
                {showQuestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-1.5 mt-1"
                  >
                    {messages.length > 1 && (
                      <p className="text-[10.5px] text-abelec-muted font-mono uppercase tracking-[0.08em] mb-0.5 px-0.5">
                        {t("chatbot.anotherQuestion")}
                      </p>
                    )}
                    {Array.from({ length: Q_COUNT }, (_, i) => i + 1).map((n) => (
                      <motion.button
                        key={n}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: n * 0.04 }}
                        onClick={() => handleQuestion(n)}
                        className="text-left px-3.5 py-2.5 rounded-xl border border-abelec-cream-line bg-white hover:border-abelec-orange hover:bg-abelec-orange/[0.04] text-[13px] text-abelec-navy font-medium transition-all duration-150"
                      >
                        {t(`chatbot.q${n}`)}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Footer: direct contact */}
            <div className="shrink-0 px-3 py-2.5 border-t border-abelec-cream-line flex gap-2">
              <a
                href={`tel:${t("topStrip.phone")}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-abelec-cream-line bg-abelec-cream-light hover:border-abelec-orange hover:bg-abelec-orange/[0.05] transition-all text-[12px] font-medium text-abelec-navy"
              >
                <Phone size={13} strokeWidth={2} className="text-abelec-orange" />
                {t("helpdeskPanel.call")}
              </a>
              <a
                href={`mailto:${t("footer.email")}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-abelec-cream-line bg-abelec-cream-light hover:border-abelec-orange hover:bg-abelec-orange/[0.05] transition-all text-[12px] font-medium text-abelec-navy"
              >
                <Mail size={13} strokeWidth={2} className="text-abelec-orange" />
                {t("helpdeskPanel.email")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
