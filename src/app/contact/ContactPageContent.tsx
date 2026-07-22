"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { contactApi } from "@/lib/api";
import Button from "@/components/ui/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const contactInfo = [
  {
    icon: Mail,
    title: "Email us",
    detail: "himanshu.suthar.dev@gmail.com",
    sub: "We reply within 24 hours",
    href: "mailto:himanshu.suthar.dev@gmail.com",
  },
  {
    icon: Phone,
    title: "Call us",
    detail: "+91 70 1485 0144",
    sub: "Mon–Sat, 10am–7pm IST",
    href: "tel:+917014850144",
  },

  {
    icon: Clock,
    title: "Support hours",
    detail: "10:00 AM – 7:00 PM",
    sub: "Monday to Saturday",
    href: undefined,
  },
];

const topics = [
  { value: "order", label: "Hiring For Job" },
  { value: "sizing", label: "Searching Frontend Dev." },
  { value: "partnership", label: "Need Fullstack Dev." },
];

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emptyForm: FormState = {
  name: "",
  email: "",
  subject: "order",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-hero > *", {
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".contact-info-card", {
        opacity: 0,
        x: -30,
        stagger: 0.12,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-info-list",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".contact-form-card", {
        opacity: 0,
        x: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-form-card",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Please tell us your name.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email))
      nextErrors.email = "Enter a valid email address.";
    if (!form.message.trim()) nextErrors.message = "Please add a message.";
    else if (form.message.trim().length < 10)
      nextErrors.message = "Message should be at least 10 characters.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
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
    <div ref={containerRef} className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-12 text-center contact-hero">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-4">
          We&apos;d love to hear from you
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-parchment mb-6 text-balance">
          Get in
          <br />
          <em className="not-italic text-[#c9a898]">touch with us.</em>
        </h1>
        <p className="text-parchment/50 text-lg leading-relaxed max-w-xl mx-auto">
          Questions about an order, a piece, or a partnership? Our team usually
          replies within a day.
        </p>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info cards */}
          <div className="lg:col-span-2 flex flex-col gap-4 contact-info-list">
            {contactInfo.map(({ icon: Icon, title, detail, sub, href }) => {
              const cardClassName =
                "contact-info-card flex items-start gap-4 p-5 rounded-2xl border border-parchment/8 bg-charcoal-light hover:border-parchment/20 transition-colors";
              const inner = (
                <>
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-rose/10 border border-rose/20 flex items-center justify-center">
                    <Icon size={18} className="text-[#c9a898]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-parchment/40 font-semibold">
                      {title}
                    </p>
                    <p className="text-sm font-semibold text-parchment mt-1">
                      {detail}
                    </p>
                    <p className="text-xs text-parchment/40 mt-0.5">{sub}</p>
                  </div>
                </>
              );

              return href ? (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {inner}
                </a>
              ) : (
                <div key={title} className={cardClassName}>
                  {inner}
                </div>
              );
            })}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="contact-form-card bg-charcoal-light border border-parchment/10 rounded-2xl p-6 md:p-8">
              {status === "success" ? (
                <div className="flex flex-col items-center text-center gap-4 py-10">
                  <div className="w-14 h-14 rounded-full bg-sage/10 border border-sage/30 flex items-center justify-center text-sage">
                    <CheckCircle2 size={26} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-parchment">
                      Message sent!
                    </h2>
                    <p className="text-sm text-parchment/50 mt-1.5 max-w-sm">
                      Thanks for reaching out — a member of the WearLoop team
                      will get back to you within 24 hours.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatus("idle")}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  noValidate
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-charcoal border border-parchment/10 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-400 mt-1.5">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-charcoal border border-parchment/10 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400 mt-1.5">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
                      What&apos;s this about?
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => updateField("subject", e.target.value)}
                      className="w-full bg-charcoal border border-parchment/10 focus:border-rose/60 text-parchment rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                    >
                      {topics.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full bg-charcoal border border-parchment/10 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none"
                    />
                    {errors.message && (
                      <p className="text-xs text-red-400 mt-1.5">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {status === "error" && (
                    <p className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
                      <AlertCircle size={14} className="shrink-0" />
                      {errorMessage}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={status === "submitting"}
                    className="mt-2 w-full bg-rose text-charcoal hover:bg-rose-dark font-bold flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <Send size={15} />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-charcoal-light border-t border-parchment/10 py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <h2 className="font-display text-2xl font-bold text-parchment mb-3">
            Looking for something specific?
          </h2>
          <p className="text-sm text-parchment/50 mb-8 max-w-md mx-auto">
            These might get you an answer faster than waiting on a reply.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/how-it-works"
              className="px-5 py-2.5 rounded-full border border-parchment/15 text-sm text-parchment/70 hover:text-parchment hover:border-parchment/40 transition-colors"
            >
              How rentals work
            </Link>
            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-full border border-parchment/15 text-sm text-parchment/70 hover:text-parchment hover:border-parchment/40 transition-colors"
            >
              Browse the collection
            </Link>
            <Link
              href="/about"
              className="px-5 py-2.5 rounded-full border border-parchment/15 text-sm text-parchment/70 hover:text-parchment hover:border-parchment/40 transition-colors"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
