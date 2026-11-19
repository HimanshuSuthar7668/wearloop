"use client";

import { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { setAuthToken, setAuthUser, isValidEmail } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Field, Input, PasswordInput, focusFirstError } from "@/components/ui/Field";
import PasswordRules from "@/components/ui/PasswordRules";
import { isPasswordValid } from "@/lib/passwordStrength";

export type AuthMode = "login" | "register";
type Errors = Partial<Record<"name" | "email" | "password", string>>;
type User = { id: string; name: string; email: string; role: string };

/**
 * Sign in / create account. Used on /auth and inside the sign-in prompt.
 * `onSignedIn` runs after a successful sign-in, once the token is stored.
 */
export default function AuthForm({
  initialMode = "login",
  onSignedIn,
  headingLevel = "h1",
  title,
  hideHeading = false,
}: {
  initialMode?: AuthMode;
  onSignedIn: (user: User) => void;
  headingLevel?: "h1" | "h2";
  /** Overrides the default heading. */
  title?: { login: string; register: string };
  /** When the surrounding dialog already has a title. */
  hideHeading?: boolean;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setErrors({});
    setFormError("");
    setNotice("");
  };

  const validate = () => {
    const next: Errors = {};
    if (mode === "register" && !form.name.trim()) next.name = "Tell us what to call you.";
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!isValidEmail(form.email)) next.email = "That doesn't look like an email address.";
    if (!form.password) next.password = "Enter your password.";
    else if (mode === "register" && !isPasswordValid(form.password))
      next.password = "Your password doesn't meet all the requirements yet.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setNotice("");
    if (!validate()) return focusFirstError(e.currentTarget as HTMLFormElement);
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await authApi.login(form.email.trim(), form.password);
        setAuthToken(res.token);
        setAuthUser(res.user);
        onSignedIn(res.user);
      } else {
        await authApi.register(form.name.trim(), form.email.trim(), form.password);
        setMode("login");
        setForm((f) => ({ ...f, password: "" }));
        setNotice("Your account is ready. Sign in with the password you just chose.");
      }
    } catch (err: unknown) {
      setFormError(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  const Heading = headingLevel;
  const heading = title ?? { login: "Sign in", register: "Create an account" };

  return (
    <div>
          {!hideHeading && <Heading className="font-display text-3xl md:text-4xl text-ink">{isLogin ? heading.login : heading.register}</Heading>}
          <p className={hideHeading ? "text-sm text-ink/70" : "mt-2 text-ink/70"}>
            {isLogin ? (
              <>
                New to WearLoop?{" "}
                <button type="button" onClick={() => switchMode("register")} className="text-ink underline underline-offset-4 hover:decoration-2">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have one?{" "}
                <button type="button" onClick={() => switchMode("login")} className="text-ink underline underline-offset-4 hover:decoration-2">
                  Sign in
                </button>
              </>
            )}
          </p>

          {notice && (
            <p role="status" className="mt-6 border-l-2 border-sage-ink bg-sage/10 px-4 py-3 text-sm text-ink">
              {notice}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
            {!isLogin && (
              <Field label="Your name" error={errors.name}>
                {(p) => (
                  <Input {...p} name="name" autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
                )}
              </Field>
            )}

            <Field label="Email" error={errors.email}>
              {(p) => (
                <Input
                  {...p}
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              )}
            </Field>

            <Field
              label="Password"
              error={errors.password}
              action={
                isLogin ? (
                  <Link href="/auth/forgot-password" className="text-ink/70 underline underline-offset-4 hover:text-ink">
                    Forgot it?
                  </Link>
                ) : undefined
              }
            >
              {(p) => (
                <>
                  <PasswordInput
                    {...p}
                    name="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                  {!isLogin && <PasswordRules password={form.password} />}
                </>
              )}
            </Field>

            {formError && (
              <p role="alert" className="border-l-2 border-red-700 bg-red-700/[0.06] px-4 py-3 text-sm text-red-800 dark:border-red-400 dark:text-red-300">
                {formError}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-1 w-full" loading={loading}>
              {isLogin ? "Sign in" : "Create account"}
            </Button>

            {!isLogin && (
              <p className="text-sm text-ink/60">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-ink">Terms</Link> and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">Privacy Policy</Link>.
              </p>
            )}
          </form>
    </div>
  );
}
