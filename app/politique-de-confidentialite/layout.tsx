import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Politique de confidentialité Abelec — traitement des données personnelles, cookies, RGPD.",
  alternates: { canonical: "https://www.abelec.be/politique-de-confidentialite" },
  robots: { index: false, follow: false },
};

export default function PolitiqueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
