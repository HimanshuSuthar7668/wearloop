"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { authApi } from "@/lib/api";
import Button from "@/components/ui/Button";

export default function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-sm text-parchment/50 hover:text-parchment transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>

        {sent ? (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-sage/10 border border-sage/30 flex items-center justify-center text-sage">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-parchment mb-2">
                Check your inbox
              </h1>
              <p className="text-parchment/50 text-sm max-w-sm">
                If an account exists for <span className="text-parchment/80">{email}</span>, we&apos;ve
                sent a password reset link. It expires in 15 minutes.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-parchment mb-2">
                Forgot your password?
              </h1>
              <p className="text-parchment/50 text-sm">
                Enter the email on your account and we&apos;ll send you a link to reset it.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-parchment/5 border border-parchment/15 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                />
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
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
