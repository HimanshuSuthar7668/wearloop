import Link from "next/link";
import { Instagram, Twitter, Youtube } from "lucide-react";

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
    <footer className="bg-charcoal-light border-t border-parchment/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-parchment/10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full border-2 border-rose flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-rose" />
              </div>
              <span className="font-display text-xl font-semibold text-parchment">
                WearLoop
              </span>
            </Link>
            <p className="text-sm text-parchment/50 leading-relaxed max-w-xs">
              Fashion in a loop. Rent premium pieces, wear them with joy, return
              them for the next person to love.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="text-parchment/40 hover:text-[#c9a898] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="text-parchment/40 hover:text-[#c9a898] transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-parchment/40 hover:text-[#c9a898] transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-parchment/40 mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-parchment/60 hover:text-parchment transition-colors"
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
          <p className="text-xs text-parchment/30">
            © {new Date().getFullYear()} WearLoop. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-parchment/30 hover:text-parchment/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-parchment/30 hover:text-parchment/60 transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="text-xs text-parchment/30 hover:text-parchment/60 transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
