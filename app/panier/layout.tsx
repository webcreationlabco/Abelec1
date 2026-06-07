import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panier",
  description: "Votre panier de commande Abelec.",
  robots: { index: false, follow: false },
};

export default function PanierLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
