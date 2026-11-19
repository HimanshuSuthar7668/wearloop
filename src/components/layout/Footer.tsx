import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Youtube } from "lucide-react";

// Add the real profile URLs here. Icons only render for entries with a URL,
// so the footer never links to "#".
const socialLinks = [
  { label: "Instagram", href: "", Icon: Instagram },
  { label: "Twitter", href: "", Icon: Twitter },
  { label: "YouTube", href: "", Icon: Youtube },
].filter((s) => s.href);

const footerLinks = {
  Explore: [
    { href: "/shop", label: "Browse All" },
    { href: "/shop?occasion=party", label: "Party Looks" },
    { href: "/shop?occasion=wedding", label: "Wedding Guest" },
    { href: "/shop?occasion=work", label: "Work Wardrobe" },
  ],
  Company: [
    { href: "/about", label: "About WearLoop" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/sustainability", label: "Sustainability" },
    { href: "/careers", label: "Careers" },
  ],
  Support: [
    { href: "/faq", label: "FAQs" },
    { href: "/sizing", label: "Sizing Guide" },
    { href: "/care", label: "Care Instructions" },
    { href: "/contact", label: "Contact Us" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-paper-2 border-t border-ink/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-ink/10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/images/wearloop-logo.svg" alt="" width={32} height={32} />
              <span className="font-display text-xl font-medium text-ink">
                WearLoop
              </span>
            </Link>
            <p className="text-sm text-ink/70 leading-relaxed max-w-xs">
              Designer clothes on rent, delivered cleaned and collected when you&apos;re done.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-4 mt-6">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink/60 hover:text-ink transition-colors"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-medium text-ink mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/60 hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ink/70">
            © {new Date().getFullYear()} WearLoop. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-ink/70 hover:text-ink/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-ink/70 hover:text-ink/60 transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="text-xs text-ink/70 hover:text-ink/60 transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
