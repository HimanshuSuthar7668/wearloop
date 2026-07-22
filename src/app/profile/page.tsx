import type { Metadata } from "next";
import ProfilePageContent from "./ProfilePageContent";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your WearLoop rentals, order history, saved sizes, and account settings.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
