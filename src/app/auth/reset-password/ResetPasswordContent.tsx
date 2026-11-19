"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import Button, { buttonClass } from "@/components/ui/Button";
import { Field, PasswordInput, focusFirstError } from "@/components/ui/Field";
import PasswordRules from "@/components/ui/PasswordRules";
import { isPasswordValid } from "@/lib/passwordStrength";

export default function ResetPasswordContent() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

type Errors = Partial<Record<"password" | "confirm", string>>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const next: Errors = {};
    if (!isPasswordValid(password)) next.password = "Your new password doesn't meet all the requirements yet.";
    if (!confirm) next.confirm = "Type the new password again.";
    else if (password !== confirm) next.confirm = "The two passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return focusFirstError(e.currentTarget as HTMLFormElement);

    setLoading(true);
    try {
      await authApi.resetPassword(token, password, confirm);
      setSuccess(true);
      setTimeout(() => router.push("/auth"), 2500);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error && err.message
          ? err.message
          : "That didn't work. The link may have expired; request a new one and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-md w-full">
          <h1 className="font-display text-3xl text-ink">This link doesn&apos;t work</h1>
          <p className="mt-3 text-ink/75 leading-relaxed">
            The reset link is incomplete, usually because it was cut off when copied. Request a new one and
            open it straight from the email.
          </p>
          <Link href="/auth/forgot-password" className={buttonClass({ className: "mt-8" })}>
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <div className="w-full max-w-md">
        {success ? (
          <div role="status">
            <h1 className="font-display text-3xl text-ink">Password changed</h1>
            <p className="mt-3 text-ink/75">Taking you to sign in…</p>
            <p className="mt-6">
              <Link href="/auth" className="text-sm text-ink underline underline-offset-4">
                Go now
              </Link>
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl text-ink">Choose a new password</h1>
            <p className="mt-2 text-ink/75">You&apos;ll use it the next time you sign in.</p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
              <Field label="New password" error={errors.password}>
                {(p) => (
                  <>
                    <PasswordInput
                      {...p}
                      name="new-password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((x) => ({ ...x, password: undefined }));
                      }}
                    />
                    <PasswordRules password={password} />
                  </>
                )}
              </Field>

              <Field label="Type it again" error={errors.confirm}>
                {(p) => (
                  <PasswordInput
                    {...p}
                    name="confirm-password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setErrors((x) => ({ ...x, confirm: undefined }));
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
                Save new password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
