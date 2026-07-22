import type { Metadata } from "next";
import ForgotPasswordContent from "./ForgotPasswordContent";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset the password for your WearLoop account securely.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
