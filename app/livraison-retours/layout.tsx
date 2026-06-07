import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livraison & Retours",
  description: "Informations livraison et retours Abelec — délais, transporteurs, procédure de retour.",
  alternates: { canonical: "https://www.abelec.be/livraison-retours" },
};

export default function LivraisonRetoursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
