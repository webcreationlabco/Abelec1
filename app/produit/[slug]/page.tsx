import type { Metadata } from "next";
import { getProductBySlug } from "@/data/products";
import ProductPage from "@/components/product-page";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Pièce introuvable",
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} — Réf. ${product.ref}`;
  const description = `${product.name} — pièce détachée électroménager. Réf. ${product.ref}. Compatible avec ${product.compatibleModels.slice(0, 3).join(", ")}. En stock, livraison 48h. Garantie 1 an.`;
  const url = `https://www.abelec.be/produit/${params.slug}`;
  const image = product.images[0] ?? "/og-image.jpg";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function Page({ params }: Props) {
  return <ProductPage slug={params.slug} />;
}
