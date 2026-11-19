"use client";

import { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import { isValidEmail } from "@/lib/utils";
import { Field, Input } from "@/components/ui/Field";


export default function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    setFormError("");
    if (!trimmed) return setFieldError("Enter the email address on your account.");
    if (!isValidEmail(trimmed)) return setFieldError("That doesn't look like an email address.");
    setFieldError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(trimmed);
      setSent(true);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't send the email just now. Try again in a minute.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <div className="w-full max-w-md">
        {sent ? (
          <div role="status">
            <h1 className="font-display text-3xl text-ink">Check your inbox</h1>
            <p className="mt-3 text-ink/75 leading-relaxed">
              If there&apos;s an account for <span className="text-ink">{email.trim()}</span>, we&apos;ve sent a
              link to reset the password. It works for 15 minutes.
            </p>
            <p className="mt-6 text-sm text-ink/70">
              Nothing arrived? Check spam, or{" "}
              <button type="button" onClick={() => setSent(false)} className="text-ink underline underline-offset-4">
                try a different email
              </button>
              .
            </p>
            <p className="mt-8">
              <Link href="/auth" className="text-sm text-ink underline underline-offset-4">
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl text-ink">Reset your password</h1>
            <p className="mt-2 text-ink/75">
              Enter the email on your account and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
              <Field label="Email" error={fieldError}>
                {(p) => (
                  <Input
                    {...p}
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldError("");
                    }}
                  />
                )}
              </Field>

              {formError && (
                <p role="alert" className="border-l-2 border-red-700 bg-red-700/[0.06] px-4 py-3 text-sm text-red-800 dark:border-red-400 dark:text-red-300">
                  {formError}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" loading={loading}>
                Send reset link
              </Button>
            </form>

            <p className="mt-6 text-sm text-ink/70">
              Remembered it?{" "}
              <Link href="/auth" className="text-ink underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
