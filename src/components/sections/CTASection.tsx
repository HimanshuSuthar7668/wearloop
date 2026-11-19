import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="px-6 md:px-10 pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto bg-ink text-paper rounded-sm px-7 py-12 md:px-14 md:py-16 grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <h2 className="font-display text-4xl md:text-[3.25rem] leading-[1.05] font-normal tracking-[-0.02em]">
            ₹500 off your first rental.
          </h2>
          <p className="mt-4 text-paper/75 max-w-md">
            Make an account and it comes off at checkout automatically. No
            subscription, no minimum spend.
          </p>
        </div>
        <div className="md:col-span-4 flex md:justify-end">
          <Link
            href="/auth?tab=register"
            className={buttonClass({ variant: "inverse" })}
          >
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
}
