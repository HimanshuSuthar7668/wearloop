import "./fonts.css";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AppProvider } from "@/context/AppContext";
import ScrollTriggerRefresh from "@/components/ui/ScrollTriggerRefresh";

export const metadata: Metadata = {
  title: "WearLoop — Rent. Wear. Return. Repeat.",
  description:
    "Discover premium fashion rentals. Wear designer clothes for any occasion without the commitment. Sustainable, affordable, endlessly stylish.",
  keywords: ["clothes rental", "fashion rental", "sustainable fashion", "designer rental"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
