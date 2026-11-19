"use client";

import { useState } from "react";
import type { Product } from "@/types";
import Button from "@/components/ui/Button";
import { Field, Input, Select, Textarea, focusFirstError } from "@/components/ui/Field";
import { cn, formatPrice } from "@/lib/utils";

export type ProductFormValues = Omit<Product, "id" | "rating" | "reviewCount" | "available">;

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

const CATEGORY_OPTIONS: { value: Product["category"]; label: string }[] = [
  { value: "dress", label: "Dress" },
  { value: "suit", label: "Suit" },
  { value: "top", label: "Kurta or top" },
  { value: "bottom", label: "Bottoms" },
  { value: "outerwear", label: "Outerwear" },
  { value: "accessory", label: "Accessory" },
];

const OCCASION_OPTIONS: { value: Product["occasion"]; label: string }[] = [
  { value: "wedding", label: "Wedding" },
  { value: "party", label: "Party" },
  { value: "formal", label: "Black tie" },
  { value: "work", label: "Work" },
  { value: "casual", label: "Everyday & travel" },
];

type Draft = {
  name: string;
  brand: string;
  category: Product["category"];
  occasion: Product["occasion"];
  description: string;
  image: string;
  retailPrice: string;
  perDay: string;
  per3Days: string;
  perWeek: string;
  sizes: string[];
  tags: string;
};

type Errors = Partial<Record<keyof Draft, string>>;

const toDraft = (p?: Partial<ProductFormValues>): Draft => ({
  name: p?.name ?? "",
  brand: p?.brand ?? "",
  category: p?.category ?? "dress",
  occasion: p?.occasion ?? "wedding",
  description: p?.description ?? "",
  image: p?.images?.[0] ?? "",
  retailPrice: p?.retailPrice ? String(p.retailPrice) : "",
  perDay: p?.rentalPrice?.perDay ? String(p.rentalPrice.perDay) : "",
  per3Days: p?.rentalPrice?.per3Days ? String(p.rentalPrice.per3Days) : "",
  perWeek: p?.rentalPrice?.perWeek ? String(p.rentalPrice.perWeek) : "",
  sizes: p?.sizes ?? [],
  tags: p?.tags?.join(", ") ?? "",
});

/** Add or edit a catalogue piece. Used by admins on the shop and product pages. */
export default function ProductForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<ProductFormValues>;
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}) {
  const [d, setD] = useState<Draft>(() => toDraft(initial));
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setD((x) => ({ ...x, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const money = (v: string) => Number(v.replace(/[^\d]/g, ""));

  const validate = () => {
    const e: Errors = {};
    if (!d.name.trim()) e.name = "Give the piece a name.";
    if (!d.brand.trim()) e.brand = "Which label is it from?";
    if (d.description.trim().length < 30) e.description = "Write at least a sentence: fabric, cut and how it fits.";
    if (!d.image.trim().startsWith("/") && !d.image.trim().startsWith("http"))
      e.image = "Use a path starting with /images/ or a full https:// link.";
    if (!money(d.retailPrice)) e.retailPrice = "Enter the retail price.";
    if (!money(d.perDay)) e.perDay = "Required.";
    if (!money(d.per3Days)) e.per3Days = "Required.";
    if (!money(d.perWeek)) e.perWeek = "Required.";
    if (money(d.perDay) && money(d.per3Days) && money(d.per3Days) < money(d.perDay))
      e.per3Days = "Should cost more than one day.";
    if (money(d.per3Days) && money(d.perWeek) && money(d.perWeek) < money(d.per3Days))
      e.perWeek = "Should cost more than three days.";
    if (d.sizes.length === 0) e.sizes = "Pick at least one size you have in stock.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return focusFirstError(ev.currentTarget as HTMLFormElement);
    onSubmit({
      name: d.name.trim(),
      brand: d.brand.trim(),
      category: d.category,
      occasion: d.occasion,
      description: d.description.trim(),
      images: [d.image.trim()],
      retailPrice: money(d.retailPrice),
      rentalPrice: { perDay: money(d.perDay), per3Days: money(d.per3Days), perWeek: money(d.perWeek) },
      sizes: ALL_SIZES.filter((s) => d.sizes.includes(s)),
      tags: d.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    });
  };

  const priceInput = (key: "retailPrice" | "perDay" | "per3Days" | "perWeek") =>
    function PriceInput(p: object) {
      return (
    <div className="relative">
      <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/60">
        ₹
      </span>
      <Input {...p} inputMode="numeric" className="pl-8 tabular-nums" value={d[key]} onChange={(e) => set(key, e.target.value)} />
    </div>
      );
    };

  const perDayEquivalent = money(d.perWeek) ? Math.round(money(d.perWeek) / 7) : 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name" error={errors.name} hint="Describe what it is, e.g. “Halter Chiffon Maxi, Navy”.">
          {(p) => <Input {...p} value={d.name} onChange={(e) => set("name", e.target.value)} />}
        </Field>
        <Field label="Label" error={errors.brand}>
          {(p) => <Input {...p} value={d.brand} onChange={(e) => set("brand", e.target.value)} />}
        </Field>
        <Field label="Category">
          {(p) => (
            <Select {...p} value={d.category} onChange={(e) => set("category", e.target.value as Product["category"])}>
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Best for">
          {(p) => (
            <Select {...p} value={d.occasion} onChange={(e) => set("occasion", e.target.value as Product["occasion"])}>
              {OCCASION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <Field label="Description" error={errors.description} hint="Members read this to decide. Mention fabric, length and any fit quirks.">
        {(p) => <Textarea {...p} rows={4} value={d.description} onChange={(e) => set("description", e.target.value)} />}
      </Field>

      <Field label="Photo" error={errors.image} hint="A path inside /public, like /images/women-dresses/wd_12.jpg">
        {(p) => <Input {...p} value={d.image} onChange={(e) => set("image", e.target.value)} spellCheck={false} />}
      </Field>

      <fieldset>
        <legend className="text-sm font-medium text-ink">Prices</legend>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label={<span className="font-normal text-ink/80">Retail</span>} error={errors.retailPrice}>
            {priceInput("retailPrice")}
          </Field>
          <Field label={<span className="font-normal text-ink/80">1 day</span>} error={errors.perDay}>
            {priceInput("perDay")}
          </Field>
          <Field label={<span className="font-normal text-ink/80">3 days</span>} error={errors.per3Days}>
            {priceInput("per3Days")}
          </Field>
          <Field
            label={<span className="font-normal text-ink/80">7 days</span>}
            error={errors.perWeek}
            hint={perDayEquivalent ? `${formatPrice(perDayEquivalent)}/day` : undefined}
          >
            {priceInput("perWeek")}
          </Field>
        </div>
      </fieldset>

      <fieldset aria-describedby={errors.sizes ? "product-sizes-error" : undefined}>
        <legend className="text-sm font-medium text-ink">Sizes in stock</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {ALL_SIZES.map((sz) => {
            const on = d.sizes.includes(sz);
            return (
              <label
                key={sz}
                className={cn(
                  "flex h-10 min-w-[3rem] cursor-pointer items-center justify-center rounded-sm border px-3 text-sm transition-colors",
                  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-paper",
                  on ? "border-ink bg-ink text-paper" : "border-ink/30 text-ink hover:border-ink/60",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => set("sizes", on ? d.sizes.filter((s) => s !== sz) : [...d.sizes, sz])}
                />
                {sz}
              </label>
            );
          })}
        </div>
        {errors.sizes && (
          <p id="product-sizes-error" className="mt-2 text-sm text-red-700 dark:text-red-400">
            {errors.sizes}
          </p>
        )}
      </fieldset>

      <Field label="Search words" optional hint="Comma separated. Helps people find it, e.g. satin, off-shoulder, navy">
        {(p) => <Input {...p} value={d.tags} onChange={(e) => set("tags", e.target.value)} />}
      </Field>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-ink/15 pt-5">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
