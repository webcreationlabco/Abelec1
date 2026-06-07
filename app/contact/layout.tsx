import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Abelec pour toute question sur une pièce détachée, une commande ou un suivi de livraison. Helpdesk humain disponible du lundi au vendredi, 9h–17h30.",
  alternates: { canonical: "https://www.abelec.be/contact" },
  openGraph: {
    title: "Contact — Abelec",
    description: "Contactez notre équipe d'experts en pièces détachées électroménager. Réponse rapide garantie.",
    url: "https://www.abelec.be/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
