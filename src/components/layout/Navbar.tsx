"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { ShoppingBag, Menu, X, User, Search, Sun, Moon, Heart } from "lucide-react";
import Image from "next/image";
import { getAuthUser, removeAuthToken, removeAuthUser } from "@/lib/utils";
import { useAppStore } from "@/context/AppContext";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isDark, setIsDark] = useState(false);
  const { cart, favourites } = useAppStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); // sync immediately on mount (handles reload mid-page)
    window.addEventListener("scroll", onScroll);
    
    // Check auth cookie
    setUser(getAuthUser());

    // Initialize theme state
    setIsDark(document.documentElement.classList.contains("dark"));
    
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-paper/95 backdrop-blur-md border-b border-ink/10" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/images/wearloop-logo.svg" alt="WearLoop Logo" width={40} height={40} />
          <span className="font-display text-xl font-medium tracking-wide text-ink">WearLoop</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-body text-ink/70 hover:text-ink transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-ink/60 hover:text-ink transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link
            href="/shop?focus=search"
            className="hidden md:flex p-2 text-ink/60 hover:text-ink transition-colors"
            aria-label="Search the collection"
          >
            <Search size={18} />
          </Link>
          <Link
            href={user ? "/profile" : "/auth"}
            className="hidden md:flex p-2 text-ink/60 hover:text-ink transition-colors items-center gap-1.5"
            aria-label="Account"
          >
            <User size={18} />
            {user && (
              <span className="text-xs font-medium max-w-[80px] truncate text-ink/80">
                {user.name.split(" ")[0]}
              </span>
            )}
          </Link>
          <Link
            href="/favourites"
            className="relative p-2 text-ink/60 hover:text-ink transition-colors"
            aria-label="Favourites"
          >
            <Heart size={18} />
            {favourites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ink text-paper text-[10px] font-semibold rounded-full flex items-center justify-center">
                {favourites.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative p-2 text-ink/60 hover:text-ink transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ink text-paper text-[10px] font-semibold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 text-ink/60 hover:text-ink transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-paper/98 backdrop-blur-md border-t border-ink/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-xl text-ink/80 hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-ink/10 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={buttonClass({ className: "w-full" })}
                >
                  My Profile ({user.name})
                </Link>
                <button
                  onClick={() => {
                    removeAuthToken();
                    removeAuthUser();
                    setUser(null);
                    setMenuOpen(false);
                    window.location.href = "/";
                  }}
                  className="w-full text-center py-2.5 border border-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/10 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link
                  href="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 border border-ink/20 rounded text-sm text-ink/70 hover:border-ink/50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?tab=register"
                  onClick={() => setMenuOpen(false)}
                  className={buttonClass({ className: "flex-1" })}
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
