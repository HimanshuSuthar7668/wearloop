"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { isValidEmail } from "@/lib/utils";
import { Field, Input, Textarea, focusFirstError } from "@/components/ui/Field";
import { PageHeader, TextLink } from "@/components/ui/Page";

const contactInfo = [
  {
    title: "Email",
    detail: "himanshu.suthar.dev@gmail.com",
    sub: "We reply within 24 hours",
    href: "mailto:himanshu.suthar.dev@gmail.com",
  },
  {
    title: "Phone",
    detail: "+91 70 1485 0144",
    sub: "Monday to Saturday, 10am to 7pm IST",
    href: "tel:+917014850144",
  },
];

interface FormState {
  name: string;
  email: string;
  message: string;
}

const emptyForm: FormState = {
  name: "",
  email: "",
  message: "",
};


export default function ContactPageContent() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Tell us who to reply to.";
    if (!form.email.trim()) nextErrors.email = "We need an email address to reply to.";
    else if (!isValidEmail(form.email))
      nextErrors.email = "That doesn't look like an email address.";
    if (!form.message.trim()) nextErrors.message = "Write a short message first.";
    else if (form.message.trim().length < 10)
      nextErrors.message = "Add a little more detail so we can help.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) return focusFirstError(e.currentTarget);

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message || "Failed to send your message. Please try again.",
        );
      }

      setStatus("success");
      setForm(emptyForm);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  }

  return (
    <div className="pt-20">
      <PageHeader
        title="Write to us."
        intro="An order, a piece you're unsure about, or a partnership idea. A real person reads every message."
      />

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <dl className="divide-y divide-ink/15 border-y border-ink/15">
            {contactInfo.map(({ title, detail, sub, href }) => (
              <div key={title} className="py-5">
                <dt className="text-sm text-ink/60">{title}</dt>
                <dd className="mt-1">
                  <a href={href} className="text-ink break-all hover:underline underline-offset-4">
                    {detail}
                  </a>
                </dd>
                <dd className="mt-1 text-sm text-ink/60">{sub}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-sm text-ink/70 leading-relaxed">
            You might find the answer faster in the{" "}
            <TextLink href="/faq">FAQ</TextLink> or on{" "}
            <TextLink href="/how-it-works">how renting works</TextLink>.
          </p>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          {status === "success" ? (
            <div className="border-t border-ink/15 pt-8">
              <h2 className="font-display text-2xl text-ink">Thanks, that&apos;s sent.</h2>
              <p className="text-ink/75 mt-2 max-w-sm">
                Someone from the team will reply within 24 hours.
              </p>
              <Button variant="secondary" size="sm" className="mt-6" onClick={() => setStatus("idle")}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Your name" error={errors.name}>
                  {(p) => (
                    <Input {...p} name="name" autoComplete="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
                  )}
                </Field>
                <Field label="Email" error={errors.email} hint="We'll reply here.">
                  {(p) => (
                    <Input
                      {...p}
                      type="email"
                      name="email"
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  )}
                </Field>
              </div>

              <Field
                label="Message"
                error={errors.message}
                hint="If it's about an order, include the order number."
              >
                {(p) => (
                  <Textarea {...p} name="message" rows={6} value={form.message} onChange={(e) => updateField("message", e.target.value)} />
                )}
              </Field>

              {status === "error" && (
                <p role="alert" className="border-l-2 border-red-700 bg-red-700/[0.06] px-4 py-3 text-sm text-red-800 dark:border-red-400 dark:text-red-300">
                  {errorMessage}
                </p>
              )}

              <div>
                <Button type="submit" loading={status === "submitting"}>
                  {status === "submitting" ? "Sending" : "Send message"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
