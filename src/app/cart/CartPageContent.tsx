"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/context/AppContext";
import { formatPrice, getAuthToken } from "@/lib/utils";
import { ordersApi, paymentsApi } from "@/lib/api";
import Button, { buttonClass } from "@/components/ui/Button";
import { priceFor, rentalSchedule, shortDate, toISODate } from "@/lib/rental";

type Step = "idle" | "placing" | "paying" | "done";

export default function CartPageContent() {
  const router = useRouter();
  const { cart, products, removeFromCart, clearCart } = useAppStore();
  const [token, setToken] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const schedule = item.startDate ? rentalSchedule(item.startDate, item.days) : null;
      return { ...item, product, price: priceFor(product, item.days), schedule };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  // A line needs a size and a date before it can be booked (older bag items may lack them).
  const incomplete = lines.filter((l) => !l.size || !l.startDate);
  const total = lines.reduce((sum, l) => sum + l.price, 0);

  const handleCheckout = async () => {
    if (!token) return router.push("/auth?redirect=/cart");
    if (incomplete.length) return;
    setError("");
    try {
      setStep("placing");
      const items = lines.map((l) => ({
        productId: Number(l.productId),
        days: l.days,
        size: l.size,
        startDate: l.startDate,
        endDate: l.schedule ? toISODate(l.schedule.lastDay) : undefined,
      }));
      const { orderId } = (await ordersApi.create({ items }, token)) as { orderId: number };

      setStep("paying");
      const transactionId = `tx_${Date.now()}${Math.random().toString(36).slice(2, 7)}`;
      await paymentsApi.create({ orderId, transactionId }, token);

      setStep("done");
      clearCart();
      setTimeout(() => router.push("/profile"), 2500);
    } catch (err: unknown) {
      setStep("idle");
      setError(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't place the order. Nothing has been charged; please try again.",
      );
    }
  };

  if (step === "done") {
    return (
      <div className="min-h-[70vh] pt-32 pb-16 max-w-6xl mx-auto px-6 md:px-10" role="status">
        <h1 className="font-display text-4xl text-ink">Booked.</h1>
        <p className="mt-3 text-ink/75 max-w-md">
          Your booking is confirmed. Taking you to your rentals…
        </p>
        <Link href="/profile" className="mt-6 inline-block text-sm text-ink underline underline-offset-4">
          Go now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display text-3xl md:text-4xl text-ink">Your bag</h1>
          {lines.length > 0 && (
            <p className="text-sm text-ink/60">
              {lines.length} {lines.length === 1 ? "piece" : "pieces"}
            </p>
          )}
        </div>

        {lines.length === 0 ? (
          <div className="mt-10 border-t border-ink/15 pt-10 pb-16">
            <p className="font-display text-2xl text-ink mb-2">Your bag is empty</p>
            <p className="text-ink/70 mb-8 max-w-sm leading-relaxed">
              Have something coming up? Start with what&apos;s popular this month.
            </p>
            <Link href="/shop" className={buttonClass()}>
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid lg:grid-cols-12 gap-10">
            <ul className="lg:col-span-8 divide-y divide-ink/15 border-y border-ink/15">
              {lines.map((l) => (
                <li key={l.productId} className="py-6 flex gap-4 md:gap-6">
                  <Link href={`/shop/${l.productId}`} className="relative w-20 h-28 md:w-24 md:h-32 shrink-0 bg-white rounded-sm overflow-hidden">
                    <Image src={l.product.images[0]} alt={l.product.name} fill sizes="96px" className="object-contain p-1.5" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm text-ink/60">{l.product.brand}</p>
                        <Link href={`/shop/${l.productId}`} className="font-display text-lg text-ink hover:underline underline-offset-4">
                          {l.product.name}
                        </Link>
                      </div>
                      <p className="text-ink tabular-nums shrink-0">{formatPrice(l.price)}</p>
                    </div>

                    <dl className="mt-3 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 text-sm">
                      <dt className="text-ink/60">Size</dt>
                      <dd className={l.size ? "text-ink" : "text-red-700 dark:text-red-400"}>{l.size || "Not chosen"}</dd>
                      <dt className="text-ink/60">Rental</dt>
                      <dd className="text-ink">{l.days === 1 ? "1 day" : `${l.days} days`}</dd>
                      <dt className="text-ink/60">Dates</dt>
                      <dd className={l.schedule ? "text-ink" : "text-red-700 dark:text-red-400"}>
                        {l.schedule ? (
                          <>
                            {shortDate(l.schedule.start)} to {shortDate(l.schedule.lastDay)}
                            <span className="block text-ink/60">
                              Arrives {shortDate(l.schedule.deliver)}, collected {shortDate(l.schedule.collect)}
                            </span>
                          </>
                        ) : (
                          "Not chosen"
                        )}
                      </dd>
                    </dl>

                    <div className="mt-3 flex gap-4 text-sm">
                      {(!l.size || !l.startDate) && (
                        <Link href={`/shop/${l.productId}`} className="text-ink underline underline-offset-4">
                          Choose size and dates
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFromCart(l.productId)}
                        className="text-ink/70 underline underline-offset-4 hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 bg-paper-2 rounded-sm p-6">
                <h2 className="font-display text-xl text-ink">Summary</h2>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink/70">Rentals</dt>
                    <dd className="text-ink tabular-nums">{formatPrice(total)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink/70">Delivery and collection</dt>
                    <dd className="text-ink">Free</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink/70">Cleaning</dt>
                    <dd className="text-ink">Included</dd>
                  </div>
                  <div className="flex justify-between border-t border-ink/15 pt-3 text-base">
                    <dt className="text-ink">Total</dt>
                    <dd className="text-ink font-medium tabular-nums">{formatPrice(total)}</dd>
                  </div>
                </dl>

                {error && (
                  <p role="alert" className="mt-5 border-l-2 border-red-700 bg-red-700/[0.06] px-4 py-3 text-sm text-red-800 dark:border-red-400 dark:text-red-300">
                    {error}
                  </p>
                )}
                {incomplete.length > 0 && (
                  <p className="mt-5 text-sm text-ink/75">
                    Choose a size and dates for {incomplete.length === 1 ? "one piece" : `${incomplete.length} pieces`} before you pay.
                  </p>
                )}

                <Button
                  className="mt-5 w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={incomplete.length > 0}
                  loading={step === "placing" || step === "paying"}
                >
                  {!token
                    ? "Sign in to pay"
                    : step === "placing"
                      ? "Reserving your pieces"
                      : step === "paying"
                        ? "Taking payment"
                        : `Pay ${formatPrice(total)}`}
                </Button>
                <p className="mt-3 text-sm text-ink/60">
                  Normal wear is always covered. Cancel free up to 24 hours before delivery.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
