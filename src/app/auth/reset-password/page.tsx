import type { Metadata } from "next";
import ResetPasswordContent from "./ResetPasswordContent";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new secure password for your WearLoop account.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordContent />;
}
