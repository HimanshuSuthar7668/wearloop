/** Public origin of the site, used for canonical URLs, the sitemap and structured data. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.wearloop.in").replace(/\/$/, "");
export const SITE_NAME = "WearLoop";

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Standard metadata for a content page: title, description, canonical URL and
 * matching Open Graph / Twitter tags (which don't use the title template).
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}) {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url, type: "website" as const },
    twitter: { title: `${title} | ${SITE_NAME}`, description },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
