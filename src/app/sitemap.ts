import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { categories, occasions } from "@/lib/mockData";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getProducts();

  const pages: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/shop", priority: 0.9, changeFrequency: "daily" },
    { path: "/how-it-works", priority: 0.6, changeFrequency: "monthly" },
    { path: "/sizing", priority: 0.5, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
    { path: "/care", priority: 0.4, changeFrequency: "monthly" },
    { path: "/sustainability", priority: 0.4, changeFrequency: "monthly" },
    { path: "/about", priority: 0.4, changeFrequency: "monthly" },
    { path: "/careers", priority: 0.3, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.1, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.1, changeFrequency: "yearly" },
  ];

  // Category and occasion listings are real, linkable pages of the shop.
  const listings = [
    ...categories.filter((c) => c.id !== "all").map((c) => `/shop?category=${c.id}`),
    ...occasions.filter((o) => o.id !== "all").map((o) => `/shop?occasion=${o.id}`),
  ];

  return [
    ...pages.map((p) => ({ url: absoluteUrl(p.path), lastModified: now, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...listings.map((path) => ({ url: absoluteUrl(path), lastModified: now, changeFrequency: "daily" as const, priority: 0.7 })),
    ...products.map((p) => ({
      url: absoluteUrl(`/shop/${p.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p.available ? 0.8 : 0.4,
      images: [absoluteUrl(p.images[0])],
    })),
  ];
}
