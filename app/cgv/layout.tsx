import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "Conditions générales de vente Abelec — pièces détachées électroménager.",
  alternates: { canonical: "https://www.abelec.be/cgv" },
};

export default function CgvLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
