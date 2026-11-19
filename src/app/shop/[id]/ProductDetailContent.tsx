"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import { formatPrice, getAuthToken, getAuthUser } from "@/lib/utils";
import Button, { buttonClass } from "@/components/ui/Button";
import { ChoiceGroup, Field, Input, focusFirstError } from "@/components/ui/Field";
import AuthPromptModal from "@/components/ui/AuthPromptModal";
import Dialog from "@/components/ui/Dialog";
import ProductForm from "@/components/admin/ProductForm";
import ProductCard from "@/components/ui/ProductCard";
import { useAppStore } from "@/context/AppContext";
import type { Product } from "@/types";
import { categories, occasions } from "@/lib/mockData";
import {
  DURATIONS,
  type Duration,
  earliestStart,
  fromISODate,
  latestStart,
  priceFor,
  rentalSchedule,
  shortDate,
  toISODate,
} from "@/lib/rental";

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

interface ProductDetailContentProps {
  productId: string;
  /** Rendered on the server so the first paint (and search engines) get the full page. */
  initialProduct?: Product;
}

type Errors = Partial<Record<"size" | "date", string>>;

export default function ProductDetailContent({ productId, initialProduct }: ProductDetailContentProps) {
  const router = useRouter();
  const {
    loaded,
    products,
    cart,
    addToCart,
    deleteProduct,
    updateProduct,
    favourites,
    addToFavourites,
    removeFromFavourites,
  } = useAppStore();
  // Store data wins (it reflects admin edits); the server copy covers first paint and API hiccups.
  const product = products.find((p) => p.id === productId) ?? initialProduct;

  const [days, setDays] = useState<Duration>(3);
  const [size, setSize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [justAdded, setJustAdded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Date limits depend on "today", so they're worked out in the browser.
  const [dateBounds, setDateBounds] = useState<{ min: string; max: string } | null>(null);
  useEffect(() => {
    setDateBounds({ min: toISODate(earliestStart()), max: toISODate(latestStart()) });
    setIsAdmin(getAuthUser()?.role === "admin");
  }, []);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && p.available && (p.occasion === product.occasion || p.category === product.category))
      .sort(
        (a, b) =>
          Number(b.occasion === product.occasion) - Number(a.occasion === product.occasion) || b.reviewCount - a.reviewCount,
      )
      .slice(0, 4);
  }, [products, product]);

  const performAddToCart = useCallback(async () => {
    if (!product) return;
    const added = await addToCart(product.id, size, days, startDate);
    if (added) setJustAdded(true);
  }, [product, size, days, startDate, addToCart]);

  if (!product) {
    if (!loaded) return <div className="min-h-screen pt-20" aria-busy="true" />;
    return (
      <div className="min-h-[70vh] pt-32 max-w-7xl mx-auto px-6 md:px-10">
        <h1 className="font-display text-3xl text-ink">We can&apos;t find that piece</h1>
        <p className="mt-3 text-ink/75 max-w-md">It may have been retired from the collection, or the link is wrong.</p>
        <Link href="/shop" className={buttonClass({ className: "mt-8" })}>
          Browse the collection
        </Link>
      </div>
    );
  }

  const isFavourited = favourites.includes(product.id);
  const inBag = cart.some((item) => item.productId === product.id);
  const price = priceFor(product, days);
  const schedule = startDate ? rentalSchedule(startDate, days) : null;
  const categoryLabel = categories.find((c) => c.id === product.category)?.label ?? "All pieces";
  const occasion = occasions.find((o) => o.id === product.occasion);
  const occasionLabel = occasion?.label;

  const validate = () => {
    const next: Errors = {};
    if (!size) next.size = "Choose a size.";
    if (!startDate) next.date = "Pick the first day you need it.";
    else if (dateBounds && (startDate < dateBounds.min || startDate > dateBounds.max))
      next.date = `Choose a date between ${shortDate(fromISODate(dateBounds.min))} and ${shortDate(fromISODate(dateBounds.max))}.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return focusFirstError(e.currentTarget);
    if (!getAuthToken()) return setShowAuthModal(true);
    performAddToCart();
  };

  const toggleFavourite = () => {
    if (!getAuthToken()) return router.push(`/auth?redirect=/shop/${product.id}`);
    if (isFavourited) removeFromFavourites(product.id);
    else addToFavourites(product.id);
  };

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-6">
        <div className="flex items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="text-sm text-ink/60">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li>
                <Link href="/shop" className="hover:text-ink hover:underline underline-offset-4">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/shop?category=${product.category}`} className="hover:text-ink hover:underline underline-offset-4">
                  {categoryLabel}
                </Link>
              </li>
              <li aria-hidden className="hidden sm:block">
                /
              </li>
              <li aria-current="page" className="hidden sm:block text-ink/80">
                {product.name}
              </li>
            </ol>
          </nav>

          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                Remove
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 grid md:grid-cols-12 gap-10 lg:gap-16">
          <div className="md:col-span-7">
            <div className="relative aspect-[4/5] bg-white rounded-sm overflow-hidden md:sticky md:top-24">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-6 md:p-10"
                sizes="(max-width: 768px) 100vw, 58vw"
                priority
              />
            </div>
          </div>

          <div className="md:col-span-5">
            <p className="text-sm text-ink/70">{product.brand}</p>
            <div className="mt-1 flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl md:text-[2.5rem] leading-tight text-ink">{product.name}</h1>
              <button
                type="button"
                onClick={toggleFavourite}
                aria-pressed={isFavourited}
                className="mt-2 inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2 py-1 text-sm text-ink/75 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <Heart size={16} className={isFavourited ? "fill-rose-ink text-rose-ink" : ""} aria-hidden />
                {isFavourited ? "Saved" : "Save"}
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/70">
              <Star size={13} className="fill-rose text-rose-ink" aria-hidden />
              <span>
                {product.rating.toFixed(1)}
                <span className="sr-only"> out of 5,</span>
              </span>
              <span aria-hidden>·</span>
              <span>from {product.reviewCount} rentals</span>
            </p>

            <div className="mt-6 border-t border-ink/15 pt-6">
              <p className="font-display text-3xl text-ink tabular-nums">
                {formatPrice(price)}
                <span className="ml-2 font-body text-base text-ink/70">for {days === 1 ? "1 day" : `${days} days`}</span>
              </p>
              <p className="mt-1 text-sm text-ink/60 tabular-nums">
                {days > 1 && <>{formatPrice(Math.round(price / days))} a day · </>}
                {formatPrice(product.retailPrice)} to buy
              </p>
            </div>

            {product.available ? (
              <form onSubmit={handleAdd} noValidate className="mt-6 flex flex-col gap-6">
                <ChoiceGroup
                  legend="How long?"
                  name="duration"
                  value={String(days)}
                  onChange={(v) => setDays(Number(v) as Duration)}
                  options={DURATIONS.map((d) => ({
                    value: String(d.days),
                    label: d.label,
                    sub: formatPrice(priceFor(product, d.days)),
                  }))}
                />

                <Field
                  label="First day you need it"
                  error={errors.date}
                  hint="We deliver the day before and collect the day after your last day."
                >
                  {(p) => (
                    <Input
                      {...p}
                      type="date"
                      name="start"
                      min={dateBounds?.min}
                      max={dateBounds?.max}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setErrors((x) => ({ ...x, date: undefined }));
                      }}
                    />
                  )}
                </Field>

                {schedule && (
                  <dl className="-mt-2 grid grid-cols-3 gap-3 rounded-sm bg-paper-2 px-4 py-3 text-sm" aria-live="polite">
                    <div>
                      <dt className="text-ink/60">Arrives</dt>
                      <dd className="text-ink">{shortDate(schedule.deliver)}</dd>
                    </div>
                    <div>
                      <dt className="text-ink/60">Wear until</dt>
                      <dd className="text-ink">{shortDate(schedule.lastDay)}</dd>
                    </div>
                    <div>
                      <dt className="text-ink/60">We collect</dt>
                      <dd className="text-ink">{shortDate(schedule.collect)}</dd>
                    </div>
                  </dl>
                )}

                <ChoiceGroup
                  legend="Size"
                  name="size"
                  value={size}
                  onChange={(v) => {
                    setSize(v);
                    setErrors((x) => ({ ...x, size: undefined }));
                  }}
                  error={errors.size}
                  columns={5}
                  action={
                    <Link href="/sizing" className="text-ink/70 underline underline-offset-4 hover:text-ink">
                      Size guide
                    </Link>
                  }
                  options={ALL_SIZES.map((s) => ({ value: s, label: s, disabled: !product.sizes.includes(s) }))}
                  hint={product.sizes.length < ALL_SIZES.length ? `Available in ${product.sizes.join(", ")}.` : undefined}
                />

                {inBag || justAdded ? (
                  <div role="status" className="border-l-2 border-sage-ink bg-sage/10 px-4 py-3">
                    <p className="text-sm text-ink">This piece is in your bag.</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Link href="/cart" className={buttonClass({ size: "sm" })}>
                        View bag
                      </Link>
                      <Link href="/shop" className={buttonClass({ size: "sm", variant: "secondary" })}>
                        Keep browsing
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Button type="submit" size="lg" className="w-full">
                    Add to bag · {formatPrice(price)}
                  </Button>
                )}
              </form>
            ) : (
              <div className="mt-6 border-l-2 border-ink/30 bg-paper-2 px-4 py-4">
                <p className="text-ink">Booked out at the moment.</p>
                <p className="mt-1 text-sm text-ink/70">Save it and it&apos;ll be waiting in your favourites when it&apos;s back.</p>
                <Button variant="secondary" size="sm" className="mt-3" onClick={toggleFavourite}>
                  {isFavourited ? "Saved to favourites" : "Save for later"}
                </Button>
              </div>
            )}

            <div className="mt-10 border-t border-ink/15 pt-6">
              <h2 className="font-display text-xl text-ink">About this piece</h2>
              <p className="mt-3 text-ink/80 leading-relaxed">{product.description}</p>
              <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10 text-sm">
                {[
                  ["Label", product.brand],
                  ["Best for", occasionLabel],
                  ["Sizes", product.sizes.join(", ")],
                  ["Cleaning", "Professionally cleaned after every rental. Please don't wash it."],
                  ["Delivery", "Free both ways, in a reusable garment bag"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                    <dt className="text-ink/60">{k}</dt>
                    <dd className="text-ink/90">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-ink/70">
                Doesn&apos;t fit when it arrives? Tell us within 2 hours for a replacement or full credit.{" "}
                <Link href="/sizing" className="underline underline-offset-4 hover:text-ink">
                  Fit Guarantee
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-10 mt-20 md:mt-28 border-t border-ink/15 pt-12">
          <h2 className="font-display text-2xl md:text-3xl text-ink">More for {occasion?.forPhrase}</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Dialog open={isEditing} onClose={() => setIsEditing(false)} title="Edit piece" size="lg">
        <ProductForm
          initial={product}
          submitLabel="Save changes"
          onCancel={() => setIsEditing(false)}
          onSubmit={(values) => {
            updateProduct(product.id, values);
            setIsEditing(false);
          }}
        />
      </Dialog>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Remove “${product.name}”?`}
        description="It disappears from the collection straight away. Existing bookings aren't cancelled."
      >
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Keep it
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteProduct(product.id);
              router.push("/shop");
            }}
          >
            Remove piece
          </Button>
        </div>
      </Dialog>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={performAddToCart}
        redirectPath={`/shop/${product.id}`}
      />
    </div>
  );
}
