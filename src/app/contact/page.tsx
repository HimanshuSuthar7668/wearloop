import type { Metadata } from "next";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact WearLoop",
  description:
    "Get in touch with the WearLoop team — order support, sizing help, partnerships, and press enquiries. We typically respond within a few hours.",
  keywords: [
    "contact WearLoop",
    "WearLoop support",
    "fashion rental customer service",
  ],
  alternates: {
    canonical: "https://www.wearloop.in/contact",
  },
  openGraph: {
    title: "Contact WearLoop",
    description:
      "Get in touch with the WearLoop team — order support, sizing help, partnerships, and press enquiries.",
    url: "https://www.wearloop.in/contact",
    type: "website",
  },
  twitter: {
    title: "Contact WearLoop",
    description:
      "Get in touch with the WearLoop team — order support, sizing help, partnerships, and press enquiries.",
  },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
