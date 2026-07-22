import "./fonts.css";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AppProvider } from "@/context/AppContext";
import ScrollTriggerRefresh from "@/components/ui/ScrollTriggerRefresh";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wearloop.in"),
  title: {
    default: "WearLoop — Rent. Wear. Return. Repeat.",
    template: "%s | WearLoop",
  },
  description:
    "Discover premium fashion rentals. Wear designer clothes for any occasion without the commitment. Sustainable, affordable, endlessly stylish.",
  keywords: [
    "clothes rental India",
    "fashion rental",
    "designer clothes on rent",
    "sustainable fashion",
    "outfit rental",
    "WearLoop",
  ],
  authors: [{ name: "WearLoop", url: "https://www.wearloop.in" }],
  creator: "WearLoop",
  publisher: "WearLoop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "WearLoop",
    title: "WearLoop — Rent. Wear. Return. Repeat.",
    description:
      "Discover premium fashion rentals. Wear designer clothes for any occasion without the commitment. Sustainable, affordable, endlessly stylish.",
    url: "https://www.wearloop.in",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WearLoop — Premium Fashion Rentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@wearloop",
    creator: "@wearloop",
    title: "WearLoop — Rent. Wear. Return. Repeat.",
    description:
      "Discover premium fashion rentals. Wear designer clothes for any occasion without the commitment.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  alternates: {
    canonical: "https://www.wearloop.in",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-charcoal text-parchment font-body antialiased">
        <AppProvider>
          <ScrollTriggerRefresh />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
