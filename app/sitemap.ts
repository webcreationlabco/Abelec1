import type { MetadataRoute } from "next";
import PRODUCTS from "@/data/products";

const BASE = "https://www.abelec.be";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                          lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/catalogue`,                          lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/contact`,                            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/partenaires`,                        lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/a-propos`,                           lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/marques`,                            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE}/livraison-retours`,                  lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/cgv`,                                lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${BASE}/produit/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
