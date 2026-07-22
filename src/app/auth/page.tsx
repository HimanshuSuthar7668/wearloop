import type { Metadata } from "next";
import AuthPageContent from "./AuthPageContent";

export const metadata: Metadata = {
  title: "Sign In or Create an Account",
  description:
    "Sign in or create a free WearLoop account to rent premium designer fashion.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AuthPage() {
  return <AuthPageContent />;
}
