import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/panier", "/compte", "/api/"],
      },
    ],
    sitemap: "https://www.abelec.be/sitemap.xml",
    host: "https://www.abelec.be",
  };
}
