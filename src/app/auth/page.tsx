import type { Metadata } from "next";
import AuthPageContent from "./AuthPageContent";

export const metadata: Metadata = {
  title: "Sign In — WearLoop",
  description: "Sign in or create a WearLoop account to rent designer fashion.",
};

export default function AuthPage() {
  return <AuthPageContent />;
}
