import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Gérez vos commandes, adresses et informations personnelles sur votre compte Abelec.",
  robots: { index: false, follow: false },
};

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
