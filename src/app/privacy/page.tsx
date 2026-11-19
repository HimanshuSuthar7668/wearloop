import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PageHeader, LegalBody, PageFooterNote, ButtonLink } from "@/components/ui/Page";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What personal data WearLoop collects, why, who we share it with and how to ask us to delete it.",
  path: "/privacy",
});

const sections = [
  {
    title: "1. Information we collect",
    body: [
      "We collect information you provide directly, such as your name, email address, phone number, delivery address, body measurements or size preferences, and payment details when you create an account, place an order, or contact support.",
      "We also collect information automatically when you use our website and app, including device information, IP address, browser type, pages visited, and interactions with our platform, through cookies and similar technologies.",
      "Where relevant, we receive limited information from our service providers, including delivery status from logistics partners and payment confirmation from payment processors.",
    ],
  },
  {
    title: "2. How we use your information",
    body: [
      "We use your information to create and manage your account, process and fulfil rental orders, coordinate delivery and returns, personalise size and style recommendations, and communicate order updates.",
      "We also use aggregated and anonymised data to improve our catalogue, pricing, and operations, and to understand trends across our member base.",
      "With your consent, we may send marketing communications about new arrivals, offers, or features. You can opt out of marketing messages at any time from your account settings or via the unsubscribe link in any email.",
    ],
  },
  {
    title: "3. Cookies and tracking technologies",
    body: [
      "We use cookies and similar technologies to keep you signed in, remember your preferences, understand how our site is used, and measure the effectiveness of our marketing.",
      "You can control cookies through your browser settings. Disabling certain cookies may limit some features of the site, such as saved carts or size preferences.",
    ],
  },
  {
    title: "4. Sharing your information",
    body: [
      "We share personal data only as needed to operate our service. This includes payment processors to securely handle transactions, logistics and delivery partners to fulfil and collect orders, cloud hosting providers to store data securely, and analytics providers to help us understand product usage.",
      "These third parties are contractually bound to use your data only for the services they provide to us and in line with applicable data protection requirements.",
      "We do not sell your personal data to third parties. We may disclose information where required by law, to enforce our Terms of Service, or to protect the rights, property, or safety of WearLoop, our members, or others.",
    ],
  },
  {
    title: "5. Data storage and security",
    body: [
      "Your data is stored on secure servers with access restricted to authorised personnel. Payment information is processed through PCI-DSS compliant payment partners, and we do not store full card details on our own systems.",
      "While we take reasonable technical and organisational measures to protect your data, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "6. Your rights",
    body: [
      "You have the right to access, correct, or request deletion of your personal data, subject to applicable law and our legitimate business and legal requirements, such as retaining records for tax, fraud prevention, or dispute resolution purposes.",
      "You may also request a copy of the personal data we hold about you, and object to certain uses of your data, including marketing communications.",
      "In line with India's Digital Personal Data Protection Act, 2023, and other applicable data protection laws, we process your personal data on the basis of your consent, contractual necessity, or our legitimate interests, and we aim to respond to verified requests within a reasonable time.",
    ],
  },
  {
    title: "7. Data retention",
    body: [
      "We retain personal data for as long as your account is active or as needed to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we securely delete or anonymise it.",
    ],
  },
  {
    title: "8. Children's privacy",
    body: [
      "WearLoop is intended for users who are 18 years of age or older. We do not knowingly collect personal data from children. If we become aware that we have inadvertently collected data from a minor, we will take steps to delete it.",
    ],
  },
  {
    title: "9. Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Material changes will be notified via email or a prominent notice on our website, and the \"Last updated\" date below will always reflect the most recent version.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-20">
      <PageHeader title="Privacy Policy" meta="Last updated 4 July 2026" />
      <LegalBody
        intro={<>This Privacy Policy explains how WearLoop (&quot;WearLoop&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, shares, and protects your personal data when you use our website, mobile app, and rental services. By using WearLoop, you agree to the practices described in this policy.</>}
        sections={sections}
      />
      <PageFooterNote
        title="Questions about your data?"
        body="To see, correct or delete what we hold about you, or for any other privacy question, write to us."
        action={<ButtonLink href="mailto:privacy@wearloop.in">privacy@wearloop.in</ButtonLink>}
      />
    </div>
  );
}
