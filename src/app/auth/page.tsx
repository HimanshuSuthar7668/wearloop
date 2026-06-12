"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authApi } from "@/lib/api";
import { setAuthToken } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        const res = await authApi.login(form.email, form.password) as { token: string };
        setAuthToken(res.token);
        window.location.href = "/shop";
      } else {
        await authApi.register(form.name, form.email, form.password);
        setTab("login");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-16 max-w-lg mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-parchment/50 hover:text-parchment transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to WearLoop
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-parchment mb-2">
            {tab === "login" ? "Welcome back." : "Join the loop."}
          </h1>
          <p className="text-parchment/50 text-sm">
            {tab === "login"
              ? "Sign in to access your rentals and wishlist."
              : "Create an account and get ₹500 off your first rental."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-parchment/5 rounded-lg p-1 mb-8">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-2 text-sm rounded transition-colors ${
                tab === t
                  ? "bg-parchment text-charcoal font-semibold"
                  : "text-parchment/50 hover:text-parchment"
              }`}
            >
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {tab === "register" && (
            <div>
              <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-parchment/5 border border-parchment/15 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-parchment/5 border border-parchment/15 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-parchment/5 border border-parchment/15 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-3 pr-10 text-sm outline-none transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment/30 hover:text-parchment/60 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <Button
            variant="primary"
            size="lg"
            className="mt-2 w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : tab === "login"
              ? "Sign In"
              : "Create Account"}
          </Button>
        </div>

        {tab === "login" && (
          <p className="text-xs text-parchment/30 text-center mt-6">
            Forgot your password?{" "}
            <a href="#" className="text-rose hover:underline">
              Reset it
            </a>
          </p>
        )}
      </div>

      {/* Right: Decorative (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-charcoal-light items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose/10 via-charcoal-light to-charcoal" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose/10 rounded-full blur-3xl" />
        <div className="relative text-center px-12">
          <div className="w-16 h-16 rounded-full border-4 border-rose/30 flex items-center justify-center mx-auto mb-6">
            <div className="w-6 h-6 rounded-full bg-rose" />
          </div>
          <h2 className="font-display text-3xl font-bold text-parchment mb-4">
            Fashion in a loop.
          </h2>
          <p className="text-parchment/50 text-sm leading-relaxed max-w-xs mx-auto">
            Rent premium pieces, wear them beautifully, return them for the
            next person to love.
          </p>
          <div className="mt-10 flex justify-center gap-6">
            {["2,400+\nPieces", "180+\nBrands", "₹500\nWelcome credit"].map(
              (stat) => (
                <div key={stat} className="text-center">
                  <p
                    className="font-display text-lg font-semibold text-rose whitespace-pre-line"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {stat.split("\n")[0]}
                  </p>
                  <p className="text-xs text-parchment/30 mt-0.5">
                    {stat.split("\n")[1]}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
