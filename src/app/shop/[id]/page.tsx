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
      title: `${product.name} — ${product.brand} | WearLoop`,
      description: product.description,
    };
  } catch {
    return {
      title: "Shop — WearLoop",
      description: "Rent designer fashion pieces from WearLoop.",
    };
  }
}

export default function ProductDetailPage({ params }: PageProps) {
  return <ProductDetailContent productId={params.id} />;
}
