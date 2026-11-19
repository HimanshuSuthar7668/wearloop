import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/catalog";
import { categories } from "@/lib/mockData";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import ProductDetailContent from "./ProductDetailContent";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Piece not found", robots: { index: false } };

  const title = `Rent the ${product.name} by ${product.brand}`;
  const description = `${product.description} From ${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.rentalPrice.perDay)} a day, delivered free.`;
  const url = absoluteUrl(`/shop/${product.id}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "website",
      images: [{ url: absoluteUrl(product.images[0]), alt: `${product.name} by ${product.brand}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [absoluteUrl(product.images[0])],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const url = absoluteUrl(`/shop/${product.id}`);
  const category = categories.find((c) => c.id === product.category);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: [absoluteUrl(product.images[0])],
      sku: `WL-${product.id}`,
      brand: { "@type": "Brand", name: product.brand },
      category: category?.label,
      ...(product.reviewCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
          bestRating: 5,
        },
      }),
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "INR",
        price: product.rentalPrice.perDay,
        availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: product.rentalPrice.perDay,
          priceCurrency: "INR",
          unitCode: "DAY",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "DAY" },
        },
        seller: { "@type": "Organization", name: SITE_NAME },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Shop", item: absoluteUrl("/shop") },
        ...(category
          ? [{ "@type": "ListItem", position: 2, name: category.label, item: absoluteUrl(`/shop?category=${category.id}`) }]
          : []),
        { "@type": "ListItem", position: category ? 3 : 2, name: product.name, item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here; "<" is escaped so a product name can't close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetailContent productId={product.id} initialProduct={product} />
    </>
  );
}
