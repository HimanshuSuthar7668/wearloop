import type { Metadata } from "next";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact WearLoop",
  description:
    "Get in touch with the WearLoop team — order support, sizing help, partnerships, and press enquiries.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
