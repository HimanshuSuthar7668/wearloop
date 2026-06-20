import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose/20 via-charcoal-light to-charcoal-light border border-rose/20 px-8 md:px-16 py-16 md:py-20 text-center">
          {/* Background orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-rose/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-sage/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-4">
              Start today
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-parchment mb-5 text-balance">
              Your first rental is{" "}
              <em className="not-italic text-[#c9a898]">on us.</em>
            </h2>
            <p className="text-parchment/50 mb-10 max-w-md mx-auto">
              Sign up today and get ₹500 off your first rental. No subscription
              required. Just great fashion, as often as you need it.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth?tab=register"
                className="inline-flex items-center justify-center gap-2 bg-rose text-charcoal font-semibold text-sm px-8 py-4 rounded-lg hover:bg-rose-dark transition-colors group"
              >
                Claim ₹500 credit
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center border border-parchment/20 text-parchment/70 hover:text-parchment font-medium text-sm px-8 py-4 rounded-lg hover:border-parchment/50 transition-colors"
              >
                Browse first
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
