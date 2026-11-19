import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PageHeader, Section, RuledList, PageFooterNote, ButtonLink, TextLink } from "@/components/ui/Page";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Open roles at WearLoop in engineering, operations, partnerships and support, in Bengaluru, Mumbai and remote.",
  path: "/careers",
});

const values = [
  {
    title: "Treat it like your own wardrobe",
    body: "Every garment, every order and every member message gets the attention we'd want ourselves. Fast is good; careful is better.",
  },
  {
    title: "Small team, real ownership",
    body: "Everyone here ships things members actually use. There aren't layers of sign-off between an idea and a member seeing it.",
  },
  {
    title: "Patient decisions",
    body: "We're building a new kind of shopping habit in India, and that takes years. We'd rather make decisions that hold up than chase a good quarter.",
  },
];

const roles = [
  {
    title: "Software Engineer",
    department: "Engineering",
    location: "Bengaluru or remote",
    description:
      "Build what members and the fulfilment team use every day, from the shop itself to the internal tools that keep stock moving.",
  },
  {
    title: "Fulfilment Ops Associate",
    department: "Operations",
    location: "Bengaluru",
    description:
      "Run inspection, cleaning and packing at the hub, and make sure every piece leaves on time and in perfect condition.",
  },
  {
    title: "Brand Partnerships Lead",
    department: "Merchandising",
    location: "Mumbai or remote",
    description:
      "Sign new labels and designers, and look after the relationships that keep the collection changing every week.",
  },
  {
    title: "Customer Experience Associate",
    department: "Support",
    location: "Remote",
    description:
      "Help members with sizing questions, delivery problems and everything in between, quickly and kindly.",
  },
];

export default function CareersPage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Help India get dressed without the waste."
        intro="We're a small team with a big problem to work on. If it sounds like your kind of problem, we'd like to hear from you."
      />

      <Section title="How we work">
        <RuledList items={values} />
      </Section>

      <Section title="Open roles" aside="All roles are full-time." tinted>
        <ul className="divide-y divide-ink/15 border-y border-ink/15">
          {roles.map(({ title, department, location, description }) => (
            <li key={title} className="py-6 grid sm:grid-cols-[1fr_1.5fr_auto] gap-x-6 gap-y-3 sm:items-baseline">
              <div>
                <h3 className="font-display text-lg text-ink">{title}</h3>
                <p className="mt-1 text-sm text-ink/60">
                  {department}, {location}
                </p>
              </div>
              <p className="text-sm text-ink/75 leading-relaxed">{description}</p>
              <TextLink href={`mailto:careers@wearloop.in?subject=Application: ${title}`}>Apply</TextLink>
            </li>
          ))}
        </ul>
      </Section>

      <PageFooterNote
        title="Nothing that fits?"
        body="Send a CV and a few lines about what you'd want to work on. We read all of them."
        action={<ButtonLink href="mailto:careers@wearloop.in?subject=General application">careers@wearloop.in</ButtonLink>}
      />
    </div>
  );
}
