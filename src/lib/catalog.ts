// Server-only: imported by route files (metadata, sitemap), never by client components.
import type { Product } from "@/types";
import { mockProducts } from "@/lib/mockData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Server-side product reads for metadata, the sitemap and first render.
 * Uses the products API (same { success, data } envelope as the browser client),
 * cached for 5 minutes, and falls back to the built-in catalogue if the API is
 * slow or unreachable, so pages and the sitemap never break because of it.
 */
async function fetchJSON<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data !== undefined ? json.data : json) as T;
  } catch {
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const products = await fetchJSON<Product[]>("/products");
  return Array.isArray(products) && products.length > 0 ? products : mockProducts;
}

export async function getProduct(id: string): Promise<Product | null> {
  const product = await fetchJSON<Product>(`/products/${encodeURIComponent(id)}`);
  if (product && product.id) return product;
  return mockProducts.find((p) => p.id === id) ?? null;
}
