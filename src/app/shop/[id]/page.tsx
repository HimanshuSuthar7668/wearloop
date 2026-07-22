import type { Metadata } from "next";
import { productsApi } from "@/lib/api";
import ProductDetailContent from "./ProductDetailContent";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const product = await productsApi.getById(params.id);
    if (!product) throw new Error("not found");
    return {
      title: `${product.name} — ${product.brand}`,
      description: product.description,
      keywords: [
        product.name,
        product.brand,
        "rent designer clothes",
        "fashion rental India",
        "WearLoop",
      ],
      alternates: {
        canonical: `https://www.wearloop.in/shop/${params.id}`,
      },
      openGraph: {
        title: `${product.name} — ${product.brand} | WearLoop`,
        description: product.description,
        url: `https://www.wearloop.in/shop/${params.id}`,
        type: "website",
        images: product.images?.[0]
          ? [
              {
                url: product.images[0],
                width: 1200,
                height: 630,
                alt: `${product.name} by ${product.brand}`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} — ${product.brand} | WearLoop`,
        description: product.description,
        images: product.images?.[0] ? [product.images[0]] : undefined,
      },
    };
  } catch {
    return {
      title: "Shop Designer Fashion Rentals",
      description: "Rent designer fashion pieces from WearLoop.",
      robots: { index: false, follow: false },
    };
  }
}

export default function ProductDetailPage({ params }: PageProps) {
  return <ProductDetailContent productId={params.id} />;
}
