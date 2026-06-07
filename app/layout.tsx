import type { Metadata, Viewport } from "next";
import { Roboto_Slab, Inter, JetBrains_Mono, Syne, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import LocaleDetector from "@/components/locale-detector";
import fr from "@/locales/fr.json";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["800"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-slab",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const BASE_URL = "https://www.abelec.be";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1A3A5C",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Abelec — La pièce détachée électroménager depuis 1983",
    template: "%s | Abelec",
  },
  description:
    "100 000 références de pièces détachées électroménager en stock. Livraison 48h dans 6 pays européens. Helpdesk humain. Entreprise familiale belge fondée en 1983.",
  keywords: ["pièces détachées", "électroménager", "Belgique", "lave-linge", "réfrigérateur", "Bosch", "Whirlpool", "Miele", "réparateur"],
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-dark-32x32.png", sizes: "32x32" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Abelec — La pièce détachée électroménager depuis 1983",
    description: "100 000 références en stock. Livraison 48h dans 6 pays. Entreprise familiale belge depuis 1983.",
    url: BASE_URL,
    siteName: "Abelec",
    locale: "fr_BE",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Abelec — 100 000 pièces détachées électroménager en stock",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abelec — La pièce détachée électroménager depuis 1983",
    description: "100 000 références en stock. Livraison 48h dans 6 pays. Entreprise familiale belge depuis 1983.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${BASE_URL}/#organization`,
      name: "Abelec",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/ABELEC_LOGO.svg`,
        width: 120,
        height: 40,
      },
      description: "Entreprise familiale belge spécialisée dans la vente de pièces détachées électroménager depuis 1983. 100 000 références en stock, livraison 48h dans 6 pays européens.",
      foundingDate: "1983",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rue de la Résistance 12",
        addressLocality: "Binche",
        postalCode: "7130",
        addressCountry: "BE",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+32-64-00-00-00",
        email: "info@abelec.be",
        availableLanguage: ["French", "Dutch"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          opens: "09:00",
          closes: "17:30",
        },
      },
      areaServed: ["BE", "FR", "NL", "DE", "IT", "LU"],
      sameAs: [
        "https://www.facebook.com/abelec",
        "https://www.linkedin.com/company/abelec",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Abelec",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/catalogue?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable} ${syne.variable} ${robotoSlab.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <I18nProvider
          initialLocale="fr"
          initialTranslations={fr as Record<string, unknown>}
        >
          <LocaleDetector />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
