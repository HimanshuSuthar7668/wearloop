import type { Metadata } from "next";
import ProfilePageContent from "./ProfilePageContent";

export const metadata: Metadata = {
  title: "My Account — WearLoop",
  description: "Manage your WearLoop rentals, orders, and account settings.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
