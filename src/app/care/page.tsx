import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PageHeader, Section, RuledList, PageFooterNote, ButtonLink } from "@/components/ui/Page";

export const metadata: Metadata = pageMetadata({
  title: "Caring for your rental",
  description:
    "What we clean and fix for you, what to avoid while you're wearing a piece, and how to send it back.",
  path: "/care",
});

const handledByUs = [
  "Professional dry cleaning after every rental",
  "A 12-point inspection before a piece goes out again",
  "Small repairs: loose buttons, stitching, steaming",
  "Stain and odour treatment that's safe for the fabric",
  "A reusable, breathable garment bag",
];

const avoidList = [
  {
    title: "Washing it yourself",
    body: "Please don't machine wash, hand wash or take it to your own dry cleaner. Our cleaners know how to treat delicate fabrics and embellishment. Home washing can shrink or discolour a piece in ways we can't undo.",
  },
  {
    title: "Perfume, makeup and self-tanner",
    body: "Spray perfume before you get dressed, and let makeup and tan set before putting anything on. These cause more stains than anything else.",
  },
  {
    title: "Irons on delicate pieces",
    body: "If something needs a touch-up, use a steamer on low. This matters most for sequins, beading, lace and printed detail.",
  },
  {
    title: "Removing the WearLoop tag",
    body: "The small tag inside lets our team track and inspect the piece. Please leave it on.",
  },
];

const returnSteps = [
  { title: "Fold it, don't stuff it", body: "Fold along the seams the way it arrived. It creases less on the way back." },
  { title: "Use the bag in the box", body: "The return bag already has a prepaid label on it. There's nothing to print." },
  { title: "Hand it over", body: "Give the sealed bag to the courier at pickup, or drop it at a partner point before your return date." },
  { title: "We do the rest", body: "It's inspected and cleaned when it reaches us, then either goes back into the collection or off for repair." },
];

export default function CarePage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Wear it properly. Just be a little kind to it."
        intro="These clothes are meant to be worn out to dinner, not kept under glass. A few habits keep them in good shape for whoever books them next."
      />

      <Section title="What we already do" aside="So you don't have to.">
        <ul className="divide-y divide-ink/15 border-y border-ink/15">
          {handledByUs.map((item) => (
            <li key={item} className="py-4 text-ink/80">{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Please avoid" tinted>
        <RuledList items={avoidList} />
      </Section>

      <Section title="Sending it back">
        <RuledList items={returnSteps} numbered />
      </Section>

      <Section title="If something goes wrong" tinted>
        <div className="max-w-2xl space-y-4 text-ink/80 leading-relaxed">
          <p>
            Wine at dinner, a snag on a door frame. It happens. Tell us as
            soon as you can, from your account or through support, and please
            don&apos;t try to fix it yourself.
          </p>
          <p>
            Normal wear never costs you anything. For more serious damage a
            repair fee of 10 to 30% of the retail price may apply, unless you
            added Accidental Damage Protection at checkout, in which case
            there&apos;s nothing to pay.
          </p>
        </div>
      </Section>

      <PageFooterNote
        title="Question about a specific fabric?"
        action={<ButtonLink href="/contact">Ask us</ButtonLink>}
      />
    </div>
  );
}
