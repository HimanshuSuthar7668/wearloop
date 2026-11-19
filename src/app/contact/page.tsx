import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = pageMetadata({
  title: "Contact us",
  description:
    "Questions about an order, sizing or a partnership? Email or call us, Monday to Saturday. We reply within 24 hours.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
