"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import Image from "next/image";

const CARRIERS = [
  { name: "Amazon Prime", src: "/images/carriers/amazon-prime.png", h: 32 },
  { name: "Colissimo",    src: "/images/carriers/colissimo.png",    h: 44 },
  { name: "DHL",          src: "/images/carriers/DHL.png",          h: 44 },
  { name: "GLS",          src: "/images/carriers/GLS.png",          h: 26 },
  { name: "Chronopost",   src: "/images/carriers/chronopost.png",   h: 32 },
  { name: "Colis Privé",  src: "/images/carriers/colis-prive.png",  h: 32 },
];

export default function ShippingSection() {
  const t = useT();

  return (
    <section className="bg-white border-t border-abelec-cream-line py-14 px-6">
      <div className="max-w-[1240px] mx-auto">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.18em] text-center mb-10"
        >
          {t("shipping.carriers")}
        </motion.p>

        {/* Partner logos */}
        <div className="flex items-center justify-center gap-10 flex-wrap">
          {CARRIERS.map((carrier, i) => (
            <motion.div
              key={carrier.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Image
                src={carrier.src}
                alt={carrier.name}
                width={120}
                height={carrier.h}
                style={{ height: `${carrier.h}px`, width: "auto" }}
                className="object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-90 transition-all duration-250 cursor-pointer"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
