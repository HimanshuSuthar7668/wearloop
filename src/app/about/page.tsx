import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = pageMetadata({
  title: "About us",
  description:
    "How three friends tired of buying an outfit for every wedding started WearLoop, and what we try to do differently.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
