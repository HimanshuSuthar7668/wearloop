"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import Button, { buttonClass } from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import ProductForm from "@/components/admin/ProductForm";
import { Input, Select } from "@/components/ui/Field";
import { categories, occasions } from "@/lib/mockData";
import { useAppStore } from "@/context/AppContext";
import { cn, getAuthUser } from "@/lib/utils";
import { POPULAR_SEARCHES, searchProducts } from "@/lib/search";
import type { FilterState } from "@/types";

const SIZES = ["XS", "S", "M", "L", "XL"];

const SORT_OPTIONS: { value: FilterState["sort"]; label: string }[] = [
  { value: "popular", label: "Most booked" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "newest", label: "Newest first" },
];

type Params = { category: string; occasion: string; size: string; sort: FilterState["sort"]; q: string };

function readParams(sp: URLSearchParams): Params {
  const sort = sp.get("sort") as FilterState["sort"] | null;
  return {
    category: sp.get("category") || "all",
    occasion: sp.get("occasion") || "all",
    size: sp.get("size") || "all",
    sort: sort && SORT_OPTIONS.some((o) => o.value === sort) ? sort : "popular",
    q: sp.get("q") || "",
  };
}

/** Builds /shop?… with defaults left out, so URLs stay short and shareable. */
function shopHref(current: Params, change: Partial<Params>) {
  const next = { ...current, ...change };
  const sp = new URLSearchParams();
  if (next.q.trim()) sp.set("q", next.q.trim());
  if (next.category !== "all") sp.set("category", next.category);
  if (next.occasion !== "all") sp.set("occasion", next.occasion);
  if (next.size !== "all") sp.set("size", next.size);
  if (next.sort !== "popular") sp.set("sort", next.sort);
  const qs = sp.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export default function ShopPageContent() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-16" />}>
      <Shop />
    </Suspense>
  );
}

function Shop() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = readParams(searchParams);
  const { products, addProduct } = useAppStore();

  const [showFilters, setShowFilters] = useState(params.occasion !== "all" || params.size !== "all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [query, setQuery] = useState(params.q);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => setIsAdmin(getAuthUser()?.role === "admin"), []);

  // Keep the box in sync when the URL changes (back button, removing a chip).
  useEffect(() => setQuery((typed) => (typed.trim() === params.q ? typed : params.q)), [params.q]);

  // The navbar search icon links here with ?focus=search.
  useEffect(() => {
    if (searchParams.get("focus") === "search") {
      searchRef.current?.focus();
      router.replace(shopHref(params, {}), { scroll: false });
    }
    // Only on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (change: Partial<Params>) => router.replace(shopHref(params, change), { scroll: false });

  const search = useMemo(() => (params.q ? searchProducts(products, params.q) : null), [products, params.q]);

  const filtered = useMemo(() => {
    const pool = search ? search.results : products;
    let result = pool.filter(
      (p) =>
        (params.category === "all" || p.category === params.category) &&
        (params.occasion === "all" || p.occasion === params.occasion) &&
        (params.size === "all" || p.sizes.includes(params.size)),
    );
    switch (params.sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.rentalPrice.per3Days - b.rentalPrice.per3Days);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.rentalPrice.per3Days - a.rentalPrice.per3Days);
        break;
      case "newest":
        result = [...result].sort((a, b) => Number(b.id) - Number(a.id));
        break;
      default:
        // With a search, keep the relevance order; otherwise most booked first.
        if (!search) result = [...result].sort((a, b) => Number(b.available) - Number(a.available) || b.reviewCount - a.reviewCount);
    }
    return result;
  }, [products, search, params.category, params.occasion, params.size, params.sort]);

  const filtersActive = params.category !== "all" || params.occasion !== "all" || params.size !== "all";
  const hiddenByFilters = Boolean(search && search.results.length > 0 && filtered.length === 0 && filtersActive);
  const mostBooked = useMemo(
    () => [...products].filter((p) => p.available).sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4),
    [products],
  );

  // Search as you type, without pushing a history entry per keystroke.
  useEffect(() => {
    if (query.trim() === params.q) return;
    const id = setTimeout(() => go({ q: query }), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const categoryLabel = params.category !== "all" ? categories.find((c) => c.id === params.category)?.label : undefined;
  const occasion = params.occasion !== "all" ? occasions.find((o) => o.id === params.occasion) : undefined;
  const occasionLabel = occasion?.label;
  const heading = categoryLabel
    ? occasion
      ? `${categoryLabel} for ${occasion.forPhrase}`
      : categoryLabel
    : occasion?.heading ?? "The collection";

  const filterChips: { label: string; clear: Partial<Params> }[] = [
    ...(occasionLabel ? [{ label: occasionLabel, clear: { occasion: "all" } }] : []),
    ...(params.size !== "all" ? [{ label: `Size ${params.size}`, clear: { size: "all" } }] : []),
  ];
  const chips = [...(params.q ? [{ label: `“${params.q}”`, clear: { q: "" } }] : []), ...filterChips];

  const pill = (on: boolean) =>
    cn(
      "inline-flex h-9 shrink-0 items-center rounded-sm border px-3.5 text-sm transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
      on ? "border-ink bg-ink text-paper" : "border-ink/25 text-ink hover:border-ink/60",
    );

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-ink">{heading}</h1>
            <p className="mt-1 text-sm text-ink/60 tabular-nums" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          <form
            role="search"
            className="w-full md:w-80"
            onSubmit={(e) => {
              e.preventDefault();
              go({ q: query });
            }}
          >
            <label htmlFor="shop-search" className="sr-only">
              Search the collection
            </label>
            <Input
              ref={searchRef}
              id="shop-search"
              type="search"
              name="q"
              placeholder="Search: satin, bandhgala, navy…"
              value={query}
              autoComplete="off"
              enterKeyHint="search"
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-y border-ink/15 py-4 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Categories" className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={shopHref(params, { category: c.id })}
                scroll={false}
                aria-current={params.category === c.id ? "page" : undefined}
                className={pill(params.category === c.id)}
              >
                {c.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-controls="shop-filters"
              className={pill(false)}
            >
              {showFilters ? "Hide filters" : "Filters"}
              {filterChips.length > 0 && <span className="ml-1.5 text-ink/60">({filterChips.length})</span>}
            </button>
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <span className="hidden sm:inline">Sort</span>
              <Select
                value={params.sort}
                onChange={(e) => go({ sort: e.target.value as FilterState["sort"] })}
                controlSize="sm"
                className="min-w-[11.5rem]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </label>
            {isAdmin && (
              <Button size="sm" onClick={() => setIsAdding(true)}>
                <Plus size={14} aria-hidden />
                Add a piece
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div id="shop-filters" className="flex flex-col gap-6 border-b border-ink/15 py-5 md:flex-row md:gap-12">
            <div>
              <p className="mb-2 text-sm font-medium text-ink">Occasion</p>
              <div className="flex flex-wrap gap-2">
                {occasions.map((o) => (
                  <Link
                    key={o.id}
                    href={shopHref(params, { occasion: o.id })}
                    scroll={false}
                    aria-current={params.occasion === o.id ? "true" : undefined}
                    className={pill(params.occasion === o.id)}
                  >
                    {o.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink">Size</p>
              <div className="flex flex-wrap gap-2">
                {["all", ...SIZES].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => go({ size: s })}
                    aria-pressed={params.size === s}
                    className={cn(pill(params.size === s), "min-w-[2.75rem] justify-center")}
                  >
                    {s === "all" ? "Any" : s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => go(chip.clear)}
                className="inline-flex items-center gap-1.5 rounded-sm bg-paper-2 px-2.5 py-1 text-sm text-ink hover:bg-ink/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                aria-label={`Remove filter ${chip.label}`}
              >
                {chip.label}
                <X size={13} aria-hidden />
              </button>
            ))}
            <Link
              href={shopHref(params, { q: "", occasion: "all", size: "all" })}
              scroll={false}
              className="ml-1 text-sm text-ink/70 underline underline-offset-4 hover:text-ink"
            >
              Clear all
            </Link>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {search && filtered.length > 0 && (search.correctedQuery || search.ignored.length > 0 || search.mode === "some") && (
          <div className="mb-8 space-y-1 text-sm text-ink/75" role="status">
            {search.correctedQuery && (
              <p>
                Showing results for <span className="text-ink">“{search.correctedQuery}”</span>.
              </p>
            )}
            {search.ignored.length > 0 && (
              <p>
                We don&apos;t have anything called {search.ignored.map((w) => `“${w}”`).join(" or ")} yet, so we left it out.
              </p>
            )}
            {search.mode === "some" && <p>Nothing matches every word, so these match some of them.</p>}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : hiddenByFilters && search ? (
          <div className="border-t border-ink/15 pt-10 pb-16">
            <p className="font-display text-2xl text-ink">
              {search.results.length} {search.results.length === 1 ? "piece matches" : "pieces match"} “{params.q}”, but not with
              these filters
            </p>
            <p className="mt-2 max-w-md text-ink/70">Remove a filter to see them.</p>
            <Link
              href={shopHref(params, { category: "all", occasion: "all", size: "all" })}
              scroll={false}
              className={buttonClass({ variant: "secondary", className: "mt-6" })}
            >
              Show all {search.results.length} for “{params.q}”
            </Link>
          </div>
        ) : (
          <div className="border-t border-ink/15 pt-10 pb-6">
            <p className="font-display text-2xl text-ink">
              {params.q ? `Nothing matches “${params.q}”` : "Nothing matches those filters"}
            </p>
            <p className="mt-2 max-w-lg text-ink/70">
              {params.q
                ? search?.ignored.length
                  ? `We don't stock anything called ${search.ignored.map((w) => `“${w}”`).join(" or ")} at the moment. Try a colour, a fabric or the event you're dressing for.`
                  : "Try a colour, a fabric or the event you're dressing for."
                : "Try another size or occasion, or clear the filters to see everything."}
            </p>

            {params.q && (
              <div className="mt-6">
                <p className="text-sm font-medium text-ink">People often search for</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <li key={term}>
                      <Link
                        href={shopHref(params, { q: term.toLowerCase(), category: "all", occasion: "all", size: "all" })}
                        scroll={false}
                        className={pill(false)}
                      >
                        {term}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-6 text-sm">
              <Link href="/shop" className="text-ink underline underline-offset-4">
                Clear {params.q ? "the search" : "filters"} and show everything
              </Link>
            </p>

            {mostBooked.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-xl text-ink">Booked most this month</h2>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
                  {mostBooked.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={isAdding}
        onClose={() => setIsAdding(false)}
        title="Add a piece"
        description="It appears in the collection as soon as you save."
        size="lg"
      >
        <ProductForm
          submitLabel="Add to collection"
          onCancel={() => setIsAdding(false)}
          onSubmit={(values) => {
            addProduct(values);
            setIsAdding(false);
          }}
        />
      </Dialog>
    </div>
  );
}
