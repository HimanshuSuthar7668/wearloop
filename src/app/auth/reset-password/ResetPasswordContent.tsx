"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle, Check, X } from "lucide-react";
import { authApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import { getPasswordRequirements, getPasswordStrength, isPasswordValid } from "@/lib/passwordStrength";

export default function ResetPasswordContent() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const requirements = getPasswordRequirements(password);
  const strength = getPasswordStrength(password);

  const handleSubmit = async () => {
    setError("");

    if (!token) {
      setError("This reset link is invalid or missing a token.");
      return;
    }
    if (!isPasswordValid(password)) {
      setError("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password, confirmPassword);
      setSuccess(true);
      setTimeout(() => router.push("/auth"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertCircle size={26} />
          </div>
          <h1 className="font-display text-2xl font-bold text-parchment">Invalid reset link</h1>
          <p className="text-parchment/50 text-sm">
            This password reset link is missing or malformed. Please request a new one.
          </p>
          <Link href="/auth/forgot-password" className="text-sm text-[#c9a898] hover:underline font-semibold">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

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

        {success ? (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-sage/10 border border-sage/30 flex items-center justify-center text-sage">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-parchment mb-2">
                Password updated
              </h1>
              <p className="text-parchment/50 text-sm">
                Redirecting you to sign in…
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-parchment mb-2">
                Set a new password
              </h1>
              <p className="text-parchment/50 text-sm">
                Choose a new password for your account.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-parchment/5 border border-parchment/15 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-3 pr-10 text-sm outline-none transition-colors"
                  />
                  <button
                    onClick={() => setShowPw(!showPw)}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment/30 hover:text-parchment/60 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= strength.score
                              ? strength.score <= 1
                                ? "bg-red-400"
                                : strength.score === 2
                                ? "bg-yellow-400"
                                : "bg-sage"
                              : "bg-parchment/10"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-parchment/40 mt-1.5">{strength.label}</p>
                    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                      {[
                        { key: "minLength", label: "8+ characters" },
                        { key: "hasUpper", label: "Uppercase letter" },
                        { key: "hasLower", label: "Lowercase letter" },
                        { key: "hasNumber", label: "Number" },
                        { key: "hasSymbol", label: "Special character" },
                      ].map(({ key, label }) => {
                        const met = requirements[key as keyof typeof requirements];
                        return (
                          <li
                            key={key}
                            className={`flex items-center gap-1.5 text-xs ${
                              met ? "text-sage" : "text-parchment/35"
                            }`}
                          >
                            {met ? <Check size={12} /> : <X size={12} />}
                            {label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full bg-parchment/5 border border-parchment/15 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-3 pr-10 text-sm outline-none transition-colors"
                  />
                  <button
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment/30 hover:text-parchment/60 transition-colors"
                  >
                    {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
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
                {loading ? "Updating…" : "Update password"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
