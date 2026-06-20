import "./fonts.css";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "WearLoop — Rent. Wear. Return. Repeat.",
  description:
    "Discover premium fashion rentals. Wear designer clothes for any occasion without the commitment. Sustainable, affordable, endlessly stylish.",
  keywords: ["clothes rental", "fashion rental", "sustainable fashion", "designer rental"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-charcoal text-parchment font-body antialiased">
        <AppProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
