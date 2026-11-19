import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button";

/** Left-aligned page title used by every content page. */
export function PageHeader({
  title,
  intro,
  meta,
}: {
  title: ReactNode;
  intro?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-12 md:pt-24 md:pb-16 grid md:grid-cols-12 gap-6 md:gap-10 items-end">
      <h1 className="md:col-span-7 font-display text-[2.6rem] leading-[1.04] md:text-6xl font-normal tracking-[-0.02em] text-ink text-balance">
        {title}
      </h1>
      {(intro || meta) && (
        <div className="md:col-span-5 md:pb-2">
          {intro && <p className="text-ink/75 leading-relaxed max-w-md">{intro}</p>}
          {meta && <p className="mt-3 text-sm text-ink/60">{meta}</p>}
        </div>
      )}
    </header>
  );
}

/** A titled band: heading on the left, content on the right on wide screens. */
export function Section({
  title,
  aside,
  children,
  tinted = false,
}: {
  title: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  tinted?: boolean;
}) {
  return (
    <section className={tinted ? "bg-paper-2 py-16 md:py-20" : "py-16 md:py-20"}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-8 md:gap-10">
        <div className="md:col-span-4">
          <h2 className="font-display text-2xl md:text-3xl font-normal text-ink leading-tight">{title}</h2>
          {aside && <div className="mt-3 text-sm text-ink/70 leading-relaxed max-w-xs">{aside}</div>}
        </div>
        <div className="md:col-span-8">{children}</div>
      </div>
    </section>
  );
}

/** Ruled list of title + body rows. Numbers are optional and stay small. */
export function RuledList({
  items,
  numbered = false,
}: {
  items: { title: ReactNode; body: ReactNode; meta?: ReactNode }[];
  numbered?: boolean;
}) {
  const Tag = numbered ? "ol" : "ul";
  return (
    <Tag className="divide-y divide-ink/15 border-y border-ink/15">
      {items.map((item, i) => (
        <li
          key={i}
          className={`py-6 grid gap-x-6 gap-y-2 ${
            numbered ? "sm:grid-cols-[2.5rem_1fr_1.5fr]" : "sm:grid-cols-[1fr_1.5fr]"
          }`}
        >
          {numbered && <span className="text-sm text-ink/60 tabular-nums pt-1">{i + 1}.</span>}
          <div>
            <h3 className="font-display text-lg text-ink leading-snug">{item.title}</h3>
            {item.meta && <p className="mt-1 text-sm text-ink/60">{item.meta}</p>}
          </div>
          <div className="text-sm text-ink/75 leading-relaxed">{item.body}</div>
        </li>
      ))}
    </Tag>
  );
}

/** Closing line + action at the bottom of a page. */
export function PageFooterNote({ title, body, action }: { title: ReactNode; body?: ReactNode; action: ReactNode }) {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
      <div className="border-t border-ink/15 pt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="font-display text-2xl md:text-3xl text-ink">{title}</p>
          {body && <p className="mt-2 text-ink/70 max-w-lg">{body}</p>}
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    </section>
  );
}

const textLinkClass =
  "text-sm text-ink underline underline-offset-[6px] decoration-ink/30 hover:decoration-ink transition-colors";

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls = buttonClass({ variant });
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return <a href={href} className={cls}>{children}</a>;
  return <Link href={href} className={cls}>{children}</Link>;
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("mailto:")) return <a href={href} className={textLinkClass}>{children}</a>;
  return <Link href={href} className={textLinkClass}>{children}</Link>;
}

/** Long-form legal page: contents list on the left, numbered sections on the right. */
export function LegalBody({
  intro,
  sections,
}: {
  intro: ReactNode;
  sections: { title: string; body: string[] }[];
}) {
  const slug = (t: string) => t.toLowerCase().replace(/^\d+\.\s*/, "").replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pb-8 grid md:grid-cols-12 gap-10">
      <nav className="hidden md:block md:col-span-3" aria-label="Contents">
        <ol className="sticky top-24 space-y-2 text-sm">
          {sections.map(({ title }) => (
            <li key={title}>
              <a href={`#${slug(title)}`} className="text-ink/70 hover:text-ink hover:underline underline-offset-4">
                {title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="md:col-span-8 md:col-start-5 max-w-2xl">
        <p className="text-ink/80 leading-relaxed">{intro}</p>
        {sections.map(({ title, body }) => (
          <section key={title} id={slug(title)} className="mt-12 scroll-mt-24">
            <h2 className="font-display text-xl md:text-2xl text-ink">{title}</h2>
            <div className="mt-4 space-y-4 text-[0.95rem] text-ink/80 leading-[1.7]">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
