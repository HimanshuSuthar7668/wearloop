import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PageHeader, LegalBody, PageFooterNote, ButtonLink } from "@/components/ui/Page";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms for renting from WearLoop: bookings, payment, late returns, damage, cancellations and your account.",
  path: "/terms",
});

const sections = [
  {
    title: "1. Acceptance of terms",
    body: [
      "By creating an account, placing an order, or otherwise using WearLoop's website, app, or services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.",
    ],
  },
  {
    title: "2. The rental agreement",
    body: [
      "Each order you place constitutes a rental agreement for the specific item(s) and rental period selected at checkout. Ownership of rented items remains with WearLoop or our brand partners at all times — renting an item does not transfer any ownership rights to you.",
      "You agree to return every rented item by the end of the agreed rental period, in the same condition it was received, subject to normal wear as described in our Care Instructions.",
    ],
  },
  {
    title: "3. Account responsibilities",
    body: [
      "You must be at least 18 years old to create a WearLoop account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
      "You agree to provide accurate, current information when creating your account and placing orders, including your delivery address and size details, and to update this information as needed.",
    ],
  },
  {
    title: "4. Payment and security deposits",
    body: [
      "All rental fees, applicable taxes, and any optional add-ons (such as Accidental Damage Protection) are charged at the time of checkout through our supported payment methods.",
      "For select high-value items, a refundable security deposit may be collected at checkout. Deposits are automatically released within a reasonable period after the item is returned and inspected in acceptable condition.",
      "We reserve the right to charge your payment method on file for late fees, repair charges, or replacement costs as described in these Terms.",
    ],
  },
  {
    title: "5. Damage, loss, and liability",
    body: [
      "Normal wear and tear on a rented item is expected and will not be charged. For damage beyond normal wear, WearLoop may charge a repair fee of up to 10–30% of the item's retail value, depending on severity.",
      "In the event an item is lost, stolen, or damaged beyond repair while in your possession, you may be charged up to the full retail value of the item.",
      "Accidental Damage Protection, where purchased at checkout, waives standard accidental damage charges but does not cover loss, theft, or intentional damage.",
    ],
  },
  {
    title: "6. Cancellations and extensions",
    body: [
      "Orders may be cancelled free of charge up to 24 hours before the scheduled delivery slot for a full refund. Cancellations made after this window may be subject to a partial charge.",
      "Rental extensions can be requested through your account up to 48 hours before the scheduled return date and are subject to item availability and additional daily charges.",
      "Items not returned by the end of the rental period, including any extension, will be treated as a late return and charged at the applicable daily rate until the item is received back by WearLoop.",
    ],
  },
  {
    title: "7. Prohibited use",
    body: [
      "You agree not to alter, resell, sublet, or use rented items for any commercial purpose without our written consent. You also agree not to misuse the platform, including creating fraudulent accounts, submitting false information, or attempting to interfere with the security or operation of our services.",
      "WearLoop reserves the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or repeatedly cause damage to rented items.",
    ],
  },
  {
    title: "8. Limitation of liability",
    body: [
      "WearLoop provides its services on an \"as available\" basis. To the maximum extent permitted by law, WearLoop shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services, including but not limited to loss of enjoyment of an event due to delivery delays outside our reasonable control.",
      "Our total liability for any claim arising from your use of WearLoop shall not exceed the amount you paid for the order giving rise to the claim.",
    ],
  },
  {
    title: "9. Governing law",
    body: [
      "These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of WearLoop shall be subject to the exclusive jurisdiction of the courts located in Bengaluru, Karnataka.",
    ],
  },
  {
    title: "10. Changes to these terms",
    body: [
      "We may update these Terms from time to time to reflect changes in our services or legal requirements. Continued use of WearLoop after an update constitutes acceptance of the revised Terms. The \"Last updated\" date below reflects the most recent version.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="pt-20">
      <PageHeader title="Terms of Service" meta="Last updated 4 July 2026" />
      <LegalBody
        intro={<>These Terms of Service (&quot;Terms&quot;) govern your access to and use of WearLoop&apos;s website, mobile app, and clothing rental services. Please read them carefully before placing an order.</>}
        sections={sections}
      />
      <PageFooterNote
        title="Something unclear?"
        body="Ask before you order and we'll explain it."
        action={<ButtonLink href="mailto:legal@wearloop.in">legal@wearloop.in</ButtonLink>}
      />
    </div>
  );
}
