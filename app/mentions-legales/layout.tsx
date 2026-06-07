import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales Abelec — éditeur, hébergeur, propriété intellectuelle.",
  alternates: { canonical: "https://www.abelec.be/mentions-legales" },
  robots: { index: false, follow: false },
};

export default function MentionsLegalesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
